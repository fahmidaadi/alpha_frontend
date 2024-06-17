import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { InternshipType } from '../Models/internship-type';

@Injectable({
  providedIn: 'root'
})
export class InternshipTypeService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedInternshipType: InternshipType | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient) { }

  // Get internship_types
  getInternshipTypes(): Observable<InternshipType[]> {
    return this.http.get<{ success: boolean; message: string; data: InternshipType[] }>(`${this.apiUrl}/type_stages`)
      .pipe(
        map(response => {
          console.log('Fetched internship types:', response.data);
          return response.data;
        })
      );
  }

  // Add internship_type
  addInternshipType(internshipType: InternshipType): Observable<InternshipType> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<InternshipType>(`${this.apiUrl}/type_stages`, internshipType, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete internship_type
  deleteInternshipType(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/type_stages/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update internship_type
  updateInternshipType(id: number|undefined, internshipTypeData: Partial<InternshipType>): Observable<InternshipType> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<InternshipType>(`${this.apiUrl}/type_stages/${id}`, internshipTypeData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Get internship Type by id
  getInternshipTypeById(internship_type_id: string): Observable<any> {
    const headers = this.createAuthorizationHeaders(); 
    console.log("result " + internship_type_id);
    return this.http.get<any>(`${this.apiUrl}/type_stages/${internship_type_id}` , {headers});
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
