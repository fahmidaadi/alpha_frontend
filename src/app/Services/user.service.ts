import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError, forkJoin, switchMap } from 'rxjs';
import { Department } from '../Models/department';
import { User } from '../Models/user';
import { UserTypeService } from './user-type.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedUser: User | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient , private userTypeService : UserTypeService) { }

  // Get user
  getUsers(): Observable<User[]> {
    return this.http.get<{ success: boolean; message: string; data: User[] }>(`${this.apiUrl}/users`)
      .pipe(
        switchMap(response => {
          const users = response.data;
          // Use forkJoin to wait for all userType requests to complete
          return forkJoin(
            users.map(user =>
              this.userTypeService.getUserTypeId(user.user_type.toString()).pipe(
                map(userType => ({
                  ...user,
                  userType
                }))
              )
            )
          );
        })
      );
  }
  // Add user
  addUser(user: User): Observable<User> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<User>(`${this.apiUrl}/users`, user, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete user
  deleteUser(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update user
  updateUser(id: number|undefined, userData: Partial<User>): Observable<User> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

   // Get user by ID
   getUserId(user_id: string): Observable<User> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<{ success: boolean; message: string; data: User }>(`${this.apiUrl}/users/${user_id}`, { headers })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }
  


  //Authorization
  
  private createAuthorizationHeaders(): HttpHeaders {
    const accessTokenString = sessionStorage.getItem('currentUser');
    if (!accessTokenString) {
      throw new Error('Access token not found in session storage');
    }

    const accessTokenObject = JSON.parse(accessTokenString);
    const accessToken = accessTokenObject.accessToken;

    if (!accessToken) {
      throw new Error('Access token not found in session storage');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    });

   

    return headers;
  }


  private handleError(error: HttpErrorResponse) {
    // Handle error logic here, e.g., logging or displaying an error message
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
