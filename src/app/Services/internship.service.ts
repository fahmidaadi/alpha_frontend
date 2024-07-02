import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  map,
  mergeMap,
  catchError,
  throwError,
  forkJoin,
  switchMap,
  of,
} from 'rxjs';
import { ClassService } from './class.service';
import { Internship } from '../Models/internship';
import { StudentService } from './student.service';
import { TrainingTypeService } from './training-type.service';
import { InternshipTypeService } from './internship-type.service';
import { SupervisorService } from './supervisor.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class InternshipService {
  private apiUrl = 'http://localhost:9000/api/v1';

  selectedInternship: Internship | null = null;
  showUpdateForm: boolean = false;

  constructor(
    private http: HttpClient,
    private classRoomService: ClassService,
    private trainingTypeService: TrainingTypeService,
    private supervisorService : SupervisorService,
    private projectService : ProjectService,
  ) {}

  // Get internship
  
  getInternships(): Observable<Internship[]> {
    return this.http.get<{ success: boolean; message: string; data: Internship[] }>(`${this.apiUrl}/stages`).pipe(
      map(response => response.data),
      mergeMap(internships => {
        const internshipObservables = internships.map(internship =>
          this.classRoomService.getClassRoomById(internship.classe_id.toString()).pipe(
            mergeMap(classRoom => {
              internship.classRoom = classRoom;
              return this.trainingTypeService.getTrainingTypeById(internship.niveau_formation_id.toString()).pipe(
                mergeMap(trainingType => {
                  internship.trainingType = trainingType;
                  return this.supervisorService.getSupervisorById(internship.encadrant_id.toString()).pipe(
                    mergeMap(supervisor => {
                      internship.supervisor = supervisor;
                      return this.projectService.getProjectById(internship.project_id.toString()).pipe(
                        map(project => {
                          internship.project = project;
                          return internship;
                        })
                      );
                    })
                  );
                })
              );
            })
          )
        );
        return forkJoin(internshipObservables);
      }),
      catchError(error => {
        console.error('Error fetching internships:', error);
        return throwError(() => new Error(error));
      })
    );
  }
  


  // Add INTERNSHIP
  addIntenship(internship: Internship): Observable<Internship> {
    const headers = this.createAuthorizationHeaders();
    
    return this.http
      .post<Internship>(`${this.apiUrl}/stages`, internship, { headers })
      .pipe(catchError(this.handleError));
  }

  // add internship with OCR

  addInternshipWithOCR() {
    //LOGIC WILL BE HERE 
  }

  // Delete internship
  deleteInternship(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http
      .delete<void>(`${this.apiUrl}/stages/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  //Update internship
  updateInternship(
    id: number | undefined,
    internshipData: Partial<Internship>
  ): Observable<Internship> {
    const headers = this.createAuthorizationHeaders();

    return this.http
      .put<Internship>(`${this.apiUrl}/stages/${id}`, internshipData, { headers })
      .pipe(catchError(this.handleError));
  }

  //Get internship by id
  getInternshipById(stageId: string): Observable<Internship> {
    return this.http.get<{ success: boolean; message: string; data: Internship }>(`${this.apiUrl}/stages/formatted/${stageId}`).pipe(
      mergeMap(response => {
        const internship = response.data;

        // Keep the existing assignments for etudiant1_cin
        internship.etudiant1_cin = internship.etudiant1_cin;
        internship.etudiant2_cin = internship.etudiant2_cin; // Assuming a second CIN field, correct if necessary

        // Fetch project data for the internship
        return this.projectService.getProjectById(internship.project_id.toString()).pipe(
          mergeMap(project => {
            internship.project = project; // Assign fetched project to internship

            // Fetch supervisor data for the internship
            return this.supervisorService.getSupervisorById(internship.encadrant_id.toString()).pipe(
              map(supervisor => {
                internship.supervisor = supervisor; // Assign fetched supervisor to internship
                return internship;
              }),
              catchError(error => {
                console.error(`Error fetching supervisor with ID ${internship.encadrant_id}:`, error);
                // Handle error if needed
                return throwError(error);
              })
            );
          }),
          catchError(error => {
            console.error(`Error fetching project with ID ${internship.project_id}:`, error);
            // Handle error if needed
            return throwError(error);
          })
        );
      }),
      catchError(error => {
        console.error(`Error fetching internship with ID ${stageId}:`, error);
        return throwError(() => new Error(error.message || 'Error fetching internship'));
      })
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
      Authorization: `Bearer ${accessToken}`,
    });

    console.log('Headers:');
    headers.keys().forEach((header) => {
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
