import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Student } from '../Models/student';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ClassService } from './class.service';
import { ClassRoom } from '../Models/classRoom';
import { TrainingTypeService } from './training-type.service';
import { TrainingService } from './training.service';
import { DepartmentService } from './department.service';
import { InternshipService } from './internship.service';
import { InternshipTypeService } from './internship-type.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:9000/api/v1'; // Your API endpoint URL

  selectedStudent: Student | null = null;
  showUpdateForm: boolean = false;

  constructor(
    private http: HttpClient,
    private classRoomService: ClassService,
    private trainingTypeService: TrainingTypeService,
    private trainingService: TrainingService,
    private departmentService: DepartmentService,
    private internshipTypeService :InternshipTypeService,
  ) {}


/////   change the getters by id to handle the fork join later 


  // Get students
  getStudents(): Observable<Student[]> {
    return this.http.get<{ success: boolean; message: string; data: Student[] }>(`${this.apiUrl}/etudiants`).pipe(
      map(response => response.data),
      mergeMap(students => {
        const studentObservables = students.map(student =>
          this.classRoomService.getClassRoomById(student.classe_id!.toString()).pipe(
            mergeMap(classRoom => {
              student.classRoom = classRoom;
              return this.trainingTypeService.getTrainingTypeById(classRoom.niveau_formation_id!.toString()).pipe(
                mergeMap(trainingType => {
                  classRoom.trainingType = trainingType;
                  return this.trainingService.getTrainingById(trainingType.formation_id!.toString()).pipe(
                    mergeMap(training => {
                      trainingType.training = training;
                      return this.departmentService.getDepartmentId(training.departement_id!.toString()).pipe(
                        map(department => {
                          training.department = department;
                          console.log(student)
                          return student;
                        })
                      );
                    })
                  );
                })
              );
            }),
            // Error handling for each nested request
            catchError(error => {
              console.error(`Error fetching data for student with CIN ${student.cin}:`, error);
              return throwError(error);
            })
          )
        );
        
        return forkJoin(studentObservables);
      }),
      catchError(this.handleError) // Top-level error handling
    );
  }

  


 
  








  // Add student
  addStudent(student: Student): Observable<Student> {
    const headers = this.createAuthorizationHeaders();

    return this.http
      .post<Student>(`${this.apiUrl}/etudiants`, student, { headers })
      .pipe(catchError(this.handleError));
  }

  // Bulk Add students with Excel

  addStudentWithExcelFile(id: number, formData: FormData): Observable<any> {
    const headers = this.createAuthorizationHeaders();
    return this.http
      .post(`${this.apiUrl}/classes/excel/${id}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete student
  deleteStudent(id: number | undefined): Observable<void> {
    const headers = this.createAuthorizationHeaders();

    return this.http
      .delete<void>(`${this.apiUrl}/etudiants/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  //Update student
  updateStudent(
    id: number | undefined,
    studentData: Partial<Student>
  ): Observable<Student> {
    const headers = this.createAuthorizationHeaders();

    return this.http
      .put<Student>(`${this.apiUrl}/etudiants/${id}`, studentData, { headers })
      .pipe(catchError(this.handleError));
  }

  //Get student by id
  getStudentById(studentId: string): Observable<Student> {
    return this.http.get<{ success: boolean; message: string; data: Student }>(`${this.apiUrl}/etudiants/${studentId}`).pipe(
      map(response => response.data),
      mergeMap(student => {
        // Fetch the associated class room
        return this.classRoomService.getClassRoomById(student.classe_id!.toString()).pipe(
          mergeMap(classRoom => {
            student.classRoom = classRoom;
            // Fetch the associated training type
            return this.trainingTypeService.getTrainingTypeById(classRoom.niveau_formation_id!.toString()).pipe(
              mergeMap(trainingType => {
                classRoom.trainingType = trainingType;
                // Fetch the associated training
                return this.trainingService.getTrainingById(trainingType.formation_id!.toString()).pipe(
                  mergeMap(training => {
                    trainingType.training = training;
                    // Fetch the associated internship type
                    return this.internshipTypeService.getInternshipTypeById(classRoom.trainingType.type_stage_id!.toString()).pipe(
                      mergeMap(internshipType => {
                        trainingType.internshipType = internshipType.data;
                        // Fetch the associated department
                        return this.departmentService.getDepartmentId(training.departement_id!.toString()).pipe(
                          map(department => {
                            training.department = department;
                            console.log(student);
                            return student;
                          })
                        );
                      })
                    );
                  })
                );
              })
            );
          })
        );
      }),
      catchError(error => {
        console.error(`Error fetching data for student with ID ${studentId}:`, error);
        return throwError(error);
      }),
      catchError(this.handleError) // Top-level error handling
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
