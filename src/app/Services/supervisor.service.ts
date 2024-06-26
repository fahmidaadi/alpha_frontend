import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap, catchError, throwError, forkJoin } from 'rxjs';
import { Supervisor } from '../Models/supervisor';
import { DepartmentService } from './department.service';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL
  selectedSupervisor: Supervisor | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient ,  private departmentService : DepartmentService) { }

 

  getSupervisors(): Observable<Supervisor[]> {
    return this.http.get<{ success: boolean; message: string; data: Supervisor[] }>(`${this.apiUrl}/encadrant`)
      .pipe(
        map(response => response.data),
        mergeMap(supervisors => {
          const observables = supervisors.map(supervisor =>
            this.departmentService.getDepartmentId(supervisor.departement_id.toString()).pipe(
              map(department => {
                supervisor.departement = department;
                return supervisor;
              }),
              catchError(error => {
                console.error('Error fetching department for supervisor:', error);
                // Optionally handle the error here
                return throwError(error); // Rethrow the error to maintain observable chain
              })
            )
          );

          return forkJoin(observables);
        }),
        catchError(error => {
          console.error('Error fetching supervisors:', error);
          // Optionally handle the error here
          return throwError(error); // Rethrow the error to maintain observable chain
        })
      );
  }




  // Add supervisor
  addSupervisor(supervisor: Supervisor): Observable<Supervisor> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<Supervisor>(`${this.apiUrl}/encadrant`, supervisor, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete supervisor
  deleteSupervisor(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/encadrant/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update supervisor
  updateSupervisor(id: number|undefined, supervisorData: Partial<Supervisor>): Observable<Supervisor> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<Supervisor>(`${this.apiUrl}/encadrant/${id}`, supervisorData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Get supervisor by id
  getSupervisorById(supervisor_id: string): Observable<any> {
    const headers = this.createAuthorizationHeaders(); 
    return this.http.get<any>(`${this.apiUrl}/encadrant/${supervisor_id}` , {headers}).pipe(
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
