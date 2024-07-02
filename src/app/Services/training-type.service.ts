import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { TrainingType } from '../Models/training-type';
import { TrainingService } from './training.service';
import { InternshipTypeService } from './internship-type.service';
import { ParcourService } from './parcour.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingTypeService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedTrainingType: TrainingType | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient ,private parcourService : ParcourService  ,private trainingService : TrainingService , private internshipTypeService : InternshipTypeService) { }

  // Get training types
  getTrainingTypes(): Observable<TrainingType[]> {
    return this.http.get<{ success: boolean; message: string; data: TrainingType[] }>(`${this.apiUrl}/niveau_formation`)
      .pipe(
        map(response => response.data), // Extract the data array from the response
        mergeMap(trainingTypes => {
          // Create an observable for each trainingType to fetch training, internshipType, and parcour
          const observables = trainingTypes.map(trainingType =>
            forkJoin({
              training: this.trainingService.getTrainingById(trainingType.formation_id!.toString()),
              internshipType: this.internshipTypeService.getInternshipTypeById(trainingType.type_stage_id!.toString()),
              parcour: this.parcourService.getParcourId(trainingType.parcour_id!.toString())
            }).pipe(
              map(({ training, internshipType, parcour }) => {
                trainingType.training = training;
                trainingType.internshipType = internshipType?.data;
                trainingType.parcour = parcour;
                return trainingType;
              }),
              catchError(error => {
                // Log error and continue with trainingType without some data
                console.error('Error fetching training type details:', error);
                return of(trainingType);
              })
            )
          );
  
          // Use forkJoin to wait for all observables to complete and emit a combined result
          return forkJoin(observables);
        }),
        catchError(this.handleError) // Top-level error handling
      );
  }

 
  
  
  



   


  // Add training type
  addTrainingType(trainingType: TrainingType): Observable<TrainingType> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<TrainingType>(`${this.apiUrl}/niveau_formation`, trainingType, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete training type
  deleteTrainingType(id: number| undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/niveau_formation/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update training type
  updateTrainingType(id: number | undefined, trainingTypeData: Partial<TrainingType>): Observable<TrainingType> {
    const headers = this.createAuthorizationHeaders();

    return this.http.put<TrainingType>(`${this.apiUrl}/niveau_formation/${id}`, trainingTypeData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  
  

  // Get training type by ID
  getTrainingTypeById(trainingType_id: string): Observable<TrainingType> {
    const headers = this.createAuthorizationHeaders();
    return this.http
      .get<{ success: boolean; message: string; data: TrainingType }>(`${this.apiUrl}/niveau_formation/${trainingType_id}`, { headers })
      .pipe(
        map(response => response.data),
        mergeMap(trainingType =>
          this.internshipTypeService.getInternshipTypeById(trainingType.type_stage_id.toString()).pipe(
            map(internshipType => {
              trainingType.internshipType = internshipType;
              return trainingType;
            })
          )
        ),
        catchError(this.handleError)
      );
  }
  

  // Create authorization headers
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

  // Handle errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
