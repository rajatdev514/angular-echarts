// Angular core imports for component creation and lifecycle hooks
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';

// Common utilities and platform check for browser/server
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importing ECharts library for charting
import * as echarts from 'echarts';

// Importing custom data service to fetch chart data
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chart', // Component's custom HTML tag
  standalone: true,      // Indicates this component is self-contained and can be used independently
  imports: [CommonModule, FormsModule], // Required Angular modules
  templateUrl: './chart.component.html', // Path to the component's HTML file
  styleUrl: './chart.component.css'      // Path to the component's CSS file
})
export class ChartComponent implements AfterViewInit {
  // Accesses the DOM element with #chart in the HTML using ViewChild
  @ViewChild('chart', { static: true }) chartRef!: ElementRef;

  // Holds the ECharts instance for rendering the chart
  chartInstance: any;

  // Stores the selected chart type (bar/line/pie)
  chartType: string = 'bar';

  // Available chart types in the dropdown
  chartTypes: string[] = ['bar', 'line', 'pie'];

  // Flag to check if the platform is browser
  isBrowser = false;

  // Stores product titles to be used as chart labels (X-axis or pie slices)
  labels: string[] = [];

  // Stores product prices to be used as chart data (Y-axis or pie values)
  values: number[] = [];

  constructor(
    private dataService: DataService, // Injecting the data service
    @Inject(PLATFORM_ID) private platformId: Object // Injecting platform ID to check server vs browser
  ) {
    // Check whether the current platform is a browser
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Lifecycle hook that runs after the component's view has been fully initialized.
   * Initializes the chart only if running in the browser.
   */
  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Create ECharts instance bound to the referenced chart DOM element
      this.chartInstance = echarts.init(this.chartRef.nativeElement);

      // Fetch and display chart data
      this.loadChartData();

      // Make chart responsive to window resizing
      window.addEventListener('resize', () => this.chartInstance.resize());
    }
  }

  /**
   * Calls the data service to retrieve chart data (products) from the API.
   * On success, maps titles and prices into respective arrays and updates the chart.
   */
  loadChartData(): void {
    this.dataService.getChartData().subscribe({
      next: (data) => {
        // Extract product titles and prices
        this.labels = data.map((item: any) => item.title);
        this.values = data.map((item: any) => item.price);

        // Update the chart using the fetched data
        this.updateChart();
      },
      error: (err) => {
        // Log any errors to the console
        console.error('Failed to load chart data:', err);
      }
    });
  }

  /**
   * Generates and sets ECharts configuration based on selected chart type.
   * Supports bar, line, and pie charts with custom styles.
   */
  updateChart(): void {
    if (!this.chartInstance) return;

    let option: any;

    // Configuration for PIE chart
    if (this.chartType === 'pie') {
      option = {
        title: {
          text: 'Product Price Distribution - Pie Chart',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'  //hovering
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left',
        //   type: 'scroll'  
        // },
        series: [
          {
            name: 'Price',
            type: 'pie',
            radius: ['50%'], // Inner and outer radius of the pie chart
            avoidLabelOverlap: true,
            label: {
              show: true,
              // formatter: '{b}: {d}%', // Show label as name: percentage
              fontSize: 12
            },
            labelLayout: {
              hideOverlap: true
            },
            emphasis: {           //Styling when a slice is hovered
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: this.labels.map((label, index) => ({
              value: this.values[index],
              name: label
            }))
          }
        ]
      };

    // Configuration for BAR or LINE chart
    } else {
      option = {
        title: {
          text: `Product Prices - ${this.chartType === 'bar' ? 'Bar' : 'Line'} Chart`,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // Pointer line in tooltip
          }
        },
        legend: {
          data: ['Price'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        dataZoom: [
          {
            type: 'slider', // Scroll slider for horizontal zoom
            xAxisIndex: 0,  // refers to primary x-axis
            start: 0,
            end: 50
          }
        ],
        xAxis: {
          type: 'category',
          data: this.labels,
          axisLabel: {
            rotate: 45, // Rotate long labels for readability
            interval: 0,
            formatter: (value: string) =>
              value.length > 12 ? value.slice(0, 12) + '…' : value // Trim long labels
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Price',
            type: this.chartType, // 'bar' or 'line'
            data: this.values,
            smooth: this.chartType === 'line', // Smooth lines for line chart
            areaStyle: this.chartType === 'line' ? {} : undefined, // Fill area under line
            itemStyle: {
              color: this.chartType === 'bar' ? '#4fe0b7' : '#64d9c6' // Custom color
            }
          }
        ]
      };
    }

    // Render the chart using the final configuration
    this.chartInstance.setOption(option);
  }
}
