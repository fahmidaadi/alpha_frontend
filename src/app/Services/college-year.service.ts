import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { CollegeYear } from '../Models/college-year';

@Injectable({
  providedIn: 'root'
})
export class CollegeYearService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedTraining: CollegeYear | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient) { }

  // Get training
  getCollegeYears(): Observable<CollegeYear[]> {
    return this.http.get<{ success: boolean; message: string; data: CollegeYear[] }>(`${this.apiUrl}/annee_universitaire`)
      .pipe(
        map(response => response.data)
      );
  }

  // Add training
  addCollegeYear(collegeYear: CollegeYear): Observable<CollegeYear> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<CollegeYear>(`${this.apiUrl}/annee_universitaire`, collegeYear, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete training
  deleteCollegeYear(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/annee_universitaire/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update training
  updateCollegeYear(id: number|undefined, collegeYearData: Partial<CollegeYear>): Observable<CollegeYear> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<CollegeYear>(`${this.apiUrl}/annee_universitaire/${id}`, collegeYearData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

   // Get training type by ID
   getCollegeYearById(collegeYear_id: string): Observable<CollegeYear> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<{ success: boolean; message: string; data: CollegeYear }>(`${this.apiUrl}/annee_universitaire/${collegeYear_id}`, { headers })
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
