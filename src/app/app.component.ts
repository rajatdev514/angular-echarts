import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ChartComponent } from './components/chart/chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ChartComponent],
  template: `
    <app-header></app-header>
    <app-chart></app-chart>
  `
})
export class AppComponent {}
