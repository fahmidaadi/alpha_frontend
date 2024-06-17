import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassRoom } from '../../../../Models/classRoom';
import { ClassService } from '../../../../Services/class.service';
import { StudentService } from '../../../../Services/student.service';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { DialogService } from '../../../../Services/dialog.service';
import { InternshipService } from '../../../../Services/internship.service';
import { TrainingTypeService } from '../../../../Services/training-type.service';
import { Student } from '../../../../Models/student';
import { TrainingType } from '../../../../Models/training-type';
import { PopupMessageService } from '../../../../Services/popup-message.service';

@Component({
  selector: 'app-add-internship',
  standalone: true,
  imports: [
    ConfirmButtonComponent,
    CommonModule,
    FormsModule,
    UiMessageComponent,
  ],
  templateUrl: './add-internship.component.html',
  styleUrl: './add-internship.component.css',
})
export class AddInternshipComponent {

  loadedClassRooms : ClassRoom[] = [];
  loadedStudents : Student[] = [];
  loadedTrainingTypes: TrainingType[] = [];

  students: {
    selectedStudentCin: string;
    selectedStudentClassroomId: number;
    selectedStudentTrainingTypeId: number;
  }[] = [{ selectedStudentCin: '', selectedStudentClassroomId: 0, selectedStudentTrainingTypeId: 0 }];

  

  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private internshipService: InternshipService,
    private dialogService: DialogService,
    private classRoomService : ClassService,
    private studentService : StudentService,
    private trainingTypeService : TrainingTypeService,
    private datePipe : DatePipe,
    private popupMessageService: PopupMessageService,
  ) {}

  ngOnInit(): void {
    this.loadClassRooms();
    this.loadStudents();
    this.loadTrainingTypes();

  }

  private loadClassRooms(): void {
    this.classRoomService.getClassRooms().subscribe(
      (classRooms: ClassRoom[]) => {
        this.loadedClassRooms = classRooms;
      },
      (error) => {
        console.error('Error fetching classRooms', error);
        this.errorMessage = 'Error loading classRooms!';
      }
    );
  }

  private loadStudents(): void {
    this.studentService.getStudents().subscribe(
      (students: Student[]) => {
        this.loadedStudents = students;
      },
      (error) => {
        console.error('Error fetching students', error);
        this.errorMessage = 'Error loading students!';
      }
    );
  }

  private loadTrainingTypes(): void {
    this.trainingTypeService.getTrainingTypes().subscribe(
      (trainingTypes: TrainingType[]) => {
        this.loadedTrainingTypes= trainingTypes;
      },
      (error) => {
        console.error('Error fetching trainingTypes', error);
        this.errorMessage = 'Error loading trainingTypes!';
      }
    );
  }

  private convertDateFormat(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }


  onStudentChange(selectedStudentCin: string, index: number): void {
    const selectedStudent = this.loadedStudents.find(student => student.cin.toString() === selectedStudentCin);
    if (selectedStudent) {
      // Update selected classroom and training type based on student
      this.students[index].selectedStudentClassroomId = selectedStudent.classe_id;
      this.students[index].selectedStudentTrainingTypeId = selectedStudent.classRoom.niveau_formation_id;
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.students.length > 0) {
      const startDate = this.convertDateFormat(form.value.start_date);
      const endDate = this.convertDateFormat(form.value.end_date);
  
      const student = this.students[0]; // Get the first student in the array
  
      const internshipData = {
        start_date: startDate,
        end_date: endDate,
        status: form.value.status,
        evaluation: form.value.evaluation,
        etudiant_cin: Number(student.selectedStudentCin),
        classe_id: student.selectedStudentClassroomId,
        niveau_formation_id: student.selectedStudentTrainingTypeId,
        classRoom: form.value.classe_id, // Assuming this is the default classroom for the internship
        student: form.value.etudiant_id, // Assuming this is the student for the current iteration
        trainingType: form.value.niveau_formation_id, // Assuming this is the training type for the current iteration
      };
  
      // Assuming you have an internshipService method to add/update internships
      this.internshipService.addIntenship(internshipData).subscribe(
        () => {
          this.popupMessageService.showPopupMessage('Stage ajouté avec succès!', 'success');

          this.successMessage = 'Stage ajouté avec succès!';
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/internship-list']);
        },
        (error) => {
          console.error('Erreur lors de l ajout du Stage', error);
          this.popupMessageService.showPopupMessage('Erreur lors de l ajout du Stage', 'error');

          this.errorMessage = 'Erreur lors de l ajout du Stage!';
          this.successMessage = null;
        }
      );
    }
  }
  

  addStudent(): void {
    if (this.students.length < 2) { 
      this.students.push({
        selectedStudentCin: '',
        selectedStudentClassroomId: 0,
        selectedStudentTrainingTypeId: 0
      });
    }
  }
  removeStudent(index: number): void {
    if (this.students.length > 1) {
      this.students.splice(index, 1);
    }
  }
  
  

}
