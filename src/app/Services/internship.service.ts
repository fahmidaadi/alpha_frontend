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
import { ClassRoom } from '../Models/classRoom';
import { Student } from '../Models/student';
import { ClassService } from './class.service';
import { Internship } from '../Models/internship';
import { StudentService } from './student.service';
import { TrainingTypeService } from './training-type.service';
import { InternshipTypeService } from './internship-type.service';
import { SupervisorService } from './supervisor.service';

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
    private internshipTypeService :InternshipTypeService ,
    private supervisorService : SupervisorService,
    private studentService : StudentService
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
                    map(supervisor => {
                      internship.supervisor = supervisor;
                      return internship;
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
      map(response => {
        const internship = response.data;

        // Assign student1 and student2 directly from the API response
        internship.etudiant1_cin = internship.etudiant1_cin;
        internship.etudiant1_cin = internship.etudiant1_cin;

        return internship;
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
