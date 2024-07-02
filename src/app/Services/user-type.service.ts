import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { User } from '../Models/user';
import { UserType } from '../Models/user-type';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedUserType: UserType | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient) { }

  // Get userType
  getUserTypes(): Observable<UserType[]> {
    return this.http.get<{ success: boolean; message: string; data: UserType[] }>(`${this.apiUrl}/usertypes`)
      .pipe(
        map(response => response.data)
      );
  }

  // Add userType
  addUserType(userType: UserType): Observable<UserType> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<UserType>(`${this.apiUrl}/usertypes`, userType, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete userType
  deleteUserType(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/usertypes/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update userType
  updateUserType(id: number|undefined, userTypeData: Partial<UserType>): Observable<UserType> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<UserType>(`${this.apiUrl}/usertypes/${id}`, userTypeData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

   // Get userType by ID
   getUserTypeId(userType_id: string): Observable<UserType> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<{ success: boolean; message: string; data: UserType }>(`${this.apiUrl}/usertypes/${userType_id}`, { headers })
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
