// Marks this class as available for dependency injection and makes it injectable across the entire app
import { Injectable } from '@angular/core';

// Importing HttpClient for making HTTP requests
import { HttpClient } from '@angular/common/http';

// Importing required RxJS operators and utilities for observables and error handling
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root' // This makes the service available globally without needing to add it in providers[]
})
export class DataService {
  // Base API URL for fetching product data
  private apiUrl = 'https://fakestoreapi.com/products';

  // Injecting Angular's HttpClient to make HTTP requests
  constructor(private http: HttpClient) {}


  getTitle() {
    return 'Angular Echarts - Product Price Visualization';
  }

  getDescription() {
    return 'This chart shows product prices fetched from an API.';
  }

  /**
   * Fetches chart data from the fake store API.
   * It returns an Observable that emits an array of product objects.
   */
  getChartData(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      // If HTTP call fails, catchError will handle it
      catchError((error) => {
        // Log the error to the browser console for debugging
        console.error('Error fetching chart data:', error);

        // Return an empty array to ensure the app continues working without crashing
        return of([]);
      })
    );
  }
}
