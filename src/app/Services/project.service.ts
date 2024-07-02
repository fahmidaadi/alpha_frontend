import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap, catchError, throwError, forkJoin } from 'rxjs';
import { Project } from '../Models/project';
import { OrganismeService } from './organisme.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL
  selectedProject: Project | null = null;
  showUpdateForm: boolean = false;

  constructor(private http: HttpClient ,  private organismeService : OrganismeService) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<{ success: boolean; message: string; data: Project[] }>(`${this.apiUrl}/projects`)
      .pipe(
        map(response => response.data),
        mergeMap(projects => {
          const ProjectObservables = projects.map(project =>
            this.organismeService.getOrganismeId(project.organisme_id!.toString())
            .pipe(
              map(organisme => {
                project.organisme = organisme; // Use optional chaining
                return project;
                }),
                // Add error handling for nested requests (optional)
                catchError(error => {
                  // Handle specific error for getProjectById
                  return throwError(error);
                })
              )
          );
          return forkJoin(ProjectObservables);
        }),
        catchError(this.handleError) // Top-level error handling
      );
  }

  // Add project
  addProject(project: Project): Observable<Project> {
    const headers = this.createAuthorizationHeaders();

    return this.http.post<Project>(`${this.apiUrl}/projects`, project, { headers })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Delete project
  deleteProject(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Update project
  updateProject(id: number|undefined, projectData: Partial<Project>): Observable<Project> {
    const headers = this.createAuthorizationHeaders();
  
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, projectData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //Get project by id
  getProjectById(project_id: string): Observable<any> {
    const headers = this.createAuthorizationHeaders();

    return this.http.get<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/projects/${project_id}`, { headers }).pipe(
      mergeMap(response => {
        const project = response.data;

        if (project.organisme_id) {
          return this.organismeService.getOrganismeId(project.organisme_id.toString()).pipe(
            map(organisme => {
              project.organisme = organisme;
              return project;
            }),
            catchError(error => {
              console.error(`Error fetching organisme with ID ${project.organisme_id}:`, error);
              // Handle error if needed
              return throwError(error);
            })
          );
        } else {
          return project;
        }
      }),
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
