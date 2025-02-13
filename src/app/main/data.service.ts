import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filter, FilterOptions } from './models/filters.model';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { DashboardData } from './models/dashboarddata.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://nhs-ncl-e9bhacdce2bkfncc.ukwest-01.azurewebsites.net/api/data'; // Replace with your actual API URL
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient) {}

  getFilters() {
    this.loadingSubject.next(true);

    return this.http.get<FilterOptions>(this.apiUrl+'/GetFilters')
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getData(filter: Filter){
    this.loadingSubject.next(true);

    return this.http.post<DashboardData>(this.apiUrl+'/GetData', filter)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
