import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError, forkJoin, mergeMap } from 'rxjs';
import { DepartmentService } from './department.service';
import { Training } from '../Models/training';
import { Department } from '../Models/department';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL
  selectedTraining: Training | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient ,  private departmentService : DepartmentService) { }

  getTrainings(): Observable<Training[]> {
    return this.http.get<{ success: boolean; message: string; data: Training[] }>(`${this.apiUrl}/formations`)
      .pipe(
        map(response => response.data),
        mergeMap(trainings => {
          const TrainingObservables = trainings.map(training =>
            this.departmentService.getDepartmentId(training.departement_id!.toString())
            .pipe(
              map(department => {
                training.department = department; // Use optional chaining
                return training;
                }),
                // Add error handling for nested requests (optional)
                catchError(error => {
                  // Handle specific error for getTrainingById
                  return throwError(error);
                })
              )
          );
          return forkJoin(TrainingObservables);
        }),
        catchError(this.handleError) // Top-level error handling
      );
  }

  // Add training
  addTraining(training: Training): Observable<Training> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<Training>(`${this.apiUrl}/formations`, training, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete training
  deleteTraining(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/formations/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update training
  updateTraining(id: number|undefined, trainingData: Partial<Training>): Observable<Training> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<Training>(`${this.apiUrl}/formations/${id}`, trainingData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Get training by id
  getTrainingById(training_id: string): Observable<any> {
    const headers = this.createAuthorizationHeaders(); 
    return this.http.get<any>(`${this.apiUrl}/formations/${training_id}` , {headers}).pipe(
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
