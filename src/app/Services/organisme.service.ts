import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Organisme } from '../Models/organisme';

@Injectable({
  providedIn: 'root'
})
export class OrganismeService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedOrganisme: Organisme | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient) { }

  // Get organisme
  getOrganismes(): Observable<Organisme[]> {
    return this.http.get<{ success: boolean; message: string; data: Organisme[] }>(`${this.apiUrl}/organismes`)
      .pipe(
        map(response => response.data)
      );
  }

  // Add organisme
  addOrganisme(organisme: Organisme): Observable<Organisme> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<Organisme>(`${this.apiUrl}/organismes`, organisme, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete organisme
  deleteOrganisme(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/organismes/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update organisme
  updateOrganisme(id: number|undefined, organismeData: Partial<Organisme>): Observable<Organisme> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<Organisme>(`${this.apiUrl}/organismes/${id}`, organismeData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

   // Get organisme type by ID
   getOrganismeId(organisme_id: string): Observable<Organisme> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<{ success: boolean; message: string; data: Organisme }>(`${this.apiUrl}/organismes/${organisme_id}`, { headers })
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
