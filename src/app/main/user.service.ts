import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { NewUser, RegistrationAuth, User } from './users/user.model';
import { ApiResponse } from './models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://nhs-ncl-e9bhacdce2bkfncc.ukwest-01.azurewebsites.net/api/user'; // Replace with your actual API URL
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    this.loadingSubject.next(true);

    return this.http.get<User[]>(this.apiUrl+'/GetUsers')
      .pipe(
        tap(response => {
          this.usersSubject.next(response);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  register(user: NewUser): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl+'/register', user)
    .pipe(
      tap(response => {
        this.loadingSubject.next(false);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  completeRegistration(userAuth: RegistrationAuth) {
    return this.http.post<boolean>(this.apiUrl+'/CompleteRegistration', userAuth)
    .pipe(
      tap(response => {
        this.loadingSubject.next(false);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  approveUser(email: string) {
    return this.http.post<boolean>(this.apiUrl+'/ApproveUser?email='+email, null)
    .pipe(
      tap(response => {
        this.loadingSubject.next(false);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  deleteUser(id: number) {

  }

  login(email: string, password: string) {
    return this.http.post<ApiResponse<User>>(this.apiUrl+'/LOGIN', {email, password})
    .pipe(
      tap(response => {
        this.loadingSubject.next(false);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // approveUser(userId: string): Observable<User> {
  //   return this.http.patch<User>(`${this.apiUrl}/${userId}/approve`, {})
  //     .pipe(
  //       tap(updatedUser => {
  //         const currentUsers = this.usersSubject.value;
  //         const updatedUsers = currentUsers.map(user => 
  //           user.id === userId ? updatedUser : user
  //         );
  //         this.usersSubject.next(updatedUsers);
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // deactivateUser(userId: string): Observable<User> {
  //   return this.http.patch<User>(`${this.apiUrl}/${userId}/deactivate`, {})
  //     .pipe(
  //       tap(updatedUser => {
  //         const currentUsers = this.usersSubject.value;
  //         const updatedUsers = currentUsers.map(user => 
  //           user.id === userId ? updatedUser : user
  //         );
  //         this.usersSubject.next(updatedUsers);
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

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
