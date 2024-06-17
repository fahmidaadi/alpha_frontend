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
} from 'rxjs';
import { ClassRoom } from '../Models/classRoom';
import { Student } from '../Models/student';
import { ClassService } from './class.service';
import { Internship } from '../Models/internship';
import { StudentService } from './student.service';
import { TrainingTypeService } from './training-type.service';
import { InternshipTypeService } from './internship-type.service';

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
    private studentService: StudentService,
    private trainingTypeService: TrainingTypeService,
    private internshipTypeService :InternshipTypeService
  ) {}

  // Get internship
  
  getInternships(): Observable<Internship[]> {
    return this.http.get<{ success: boolean; message: string; data: Internship[] }>(`${this.apiUrl}/stage`).pipe(
      map(response => response.data),
      mergeMap(internships => {
        const internshipObservables = internships.map(internship =>
          this.studentService.getStudentById(internship.etudiant_cin.toString()).pipe(
            mergeMap(student => {
              internship.student = student;
              return this.classRoomService.getClassRoomById(internship.classe_id.toString()).pipe(
                mergeMap(classRoom => {
                  internship.classRoom = classRoom;
                  return this.trainingTypeService.getTrainingTypeById(internship.niveau_formation_id.toString()).pipe(
                    map(trainingType => {
                      internship.trainingType = trainingType;
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
        throw error;
      })
    );
  }


  // Add INTERNSHIP
  addIntenship(internship: Internship): Observable<Internship> {
    const headers = this.createAuthorizationHeaders();

    return this.http
      .post<Internship>(`${this.apiUrl}/stage`, internship, { headers })
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
      .delete<void>(`${this.apiUrl}/stage/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  //Update internship
  updateInternship(
    id: number | undefined,
    internshipData: Partial<Internship>
  ): Observable<Internship> {
    const headers = this.createAuthorizationHeaders();

    return this.http
      .put<Internship>(`${this.apiUrl}/stage/${id}`, internshipData, { headers })
      .pipe(catchError(this.handleError));
  }

  //Get internship by id
  getInternshipById(stageId: string): Observable<Internship> {
    return this.http.get<{ success: boolean; message: string; data: Internship }>(`${this.apiUrl}/stage/${stageId}`).pipe(
      map(response => response.data),
      mergeMap(internship =>
        this.studentService.getStudentById(internship.etudiant_cin.toString()).pipe(
          mergeMap(student => {
            internship.student = student;
            return this.classRoomService.getClassRoomById(internship.classe_id.toString()).pipe(
              mergeMap(classRoom => {
                internship.classRoom = classRoom;
                return this.trainingTypeService.getTrainingTypeById(internship.niveau_formation_id.toString()).pipe(
                  mergeMap(trainingType => {
                    internship.trainingType = trainingType;
                    return this.internshipTypeService.getInternshipTypeById(trainingType.type_stage_id.toString()).pipe(
                      map(internshipType => {
                        internship.trainingType.internshipType = internshipType;
                        return internship;
                      })
                    );
                  })
                );
              })
            );
          })
        )
      ),
      catchError(error => {
        console.error(`Error fetching data for internship with ID ${stageId}:`, error);
        throw error;
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
