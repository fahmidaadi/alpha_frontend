import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Parcour } from '../Models/parcour';

@Injectable({
  providedIn: 'root'
})
export class ParcourService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL


  constructor(private http: HttpClient) { }

  // Get training
  getParcours(): Observable<Parcour[]> {
    return this.http.get<{ success: boolean; message: string; data: Parcour[] }>(`${this.apiUrl}/parcours`)
      .pipe(
        map(response => response.data)
      );
  }

  // Add training
  addParcour(parcour: Parcour): Observable<Parcour> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<Parcour>(`${this.apiUrl}/parcours`, parcour, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete training
  deleteParcour(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/parcours/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update training
  updateParcour(id: number|undefined, parcourData: Partial<Parcour>): Observable<Parcour> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<Parcour>(`${this.apiUrl}/parcours/${id}`, parcourData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

   // Get training type by ID
   getParcourId(parcour_id: string): Observable<Parcour> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<{ success: boolean; message: string; data: Parcour }>(`${this.apiUrl}/parcours/${parcour_id}`, { headers })
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
