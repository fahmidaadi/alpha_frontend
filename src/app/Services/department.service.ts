import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap, catchError, throwError, forkJoin } from 'rxjs';
import { ClassRoom } from '../Models/classRoom';
import { Department } from '../Models/department';
import { TrainingTypeService } from './training-type.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedTraining: Department | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient) { }

  // Get training
  getDepartments(): Observable<Department[]> {
    return this.http.get<{ success: boolean; message: string; data: Department[] }>(`${this.apiUrl}/departements`)
      .pipe(
        map(response => response.data)
      );
  }

  // Add training
  addDepartment(department: Department): Observable<Department> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<Department>(`${this.apiUrl}/departements`, department, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete training
  deleteDepartment(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/departements/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update training
  updateDepartment(id: number|undefined, departmentData: Partial<Department>): Observable<Department> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<Department>(`${this.apiUrl}/departements/${id}`, departmentData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

   // Get training type by ID
   getDepartmentId(department_id: string): Observable<Department> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<{ success: boolean; message: string; data: Department }>(`${this.apiUrl}/departements/${department_id}`, { headers })
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

    console.log("Headers:");
    headers.keys().forEach(header => {
      console.log(`${header}: ${headers.get(header)}`);
    });

    return headers;
  }


  private handleError(error: HttpErrorResponse) {
    // Handle error logic here, e.g., logging or displaying an error message
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
