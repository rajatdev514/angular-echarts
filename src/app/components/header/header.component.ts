import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  `,
  styles: [`
    h1 { 
      font-size: 2rem;
      text-align: center;
    }
    p { color: gray; text-align: center; }
  `]
})
export class HeaderComponent {
  title = '';
  description = '';

  constructor(private dataService: DataService) {
    this.title = this.dataService.getTitle();
    this.description = this.dataService.getDescription();
  }
}
