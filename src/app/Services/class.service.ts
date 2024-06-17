import { Injectable } from '@angular/core';
import { ClassRoom } from '../Models/classRoom';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, mergeMap, catchError, throwError, forkJoin } from 'rxjs';
import { TrainingTypeService } from './training-type.service';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedClassRoom: ClassRoom | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient ,  private trainingTypeService : TrainingTypeService) { }

  // Get training types
  getClassRooms(): Observable<ClassRoom[]> {
    return this.http.get<{ success: boolean; message: string; data: ClassRoom[] }>(`${this.apiUrl}/classes`)
      .pipe(
        map(response => response.data),
        mergeMap(classRooms => {
          const classRoomObservables = classRooms.map(classRoom =>
            this.trainingTypeService.getTrainingTypeById(classRoom.niveau_formation_id!.toString())
              .pipe(
                map(trainingType => {
                  classRoom.trainingType = trainingType; // Use optional chaining
                  return classRoom;
                }),
                // Add error handling for nested requests (optional)
                catchError(error => {
                  // Handle specific error for getTrainingById
                  return throwError(error);
                })
              )
          );
          return forkJoin(classRoomObservables);
        }),
        catchError(this.handleError) // Top-level error handling
      );
  }
  
  

  // Add training type
  addClassRoom(classRoom: ClassRoom): Observable<ClassRoom> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<ClassRoom>(`${this.apiUrl}/classes`, classRoom, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete training type
  deleteClassRoom(id: number| undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/classes/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update training type
  updateClassRoom(id: number | undefined, classRoomData: Partial<ClassRoom>): Observable<ClassRoom> {
    const headers = this.createAuthorizationHeaders();

    return this.http.put<ClassRoom>(`${this.apiUrl}/classes/${id}`, classRoomData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  
  

  // Get training type by ID
  getClassRoomById(classRoom_id: string): Observable<ClassRoom> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<{ success: boolean; message: string; data: ClassRoom }>(`${this.apiUrl}/classes/${classRoom_id}`, { headers })
      .pipe(
        map(response => response.data),
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

    console.log("Headers:");
    headers.keys().forEach(header => {
      console.log(`${header}: ${headers.get(header)}`);
    });

    return headers;
  }

  // Handle errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
