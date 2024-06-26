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
    // Check if the form is valid and there are students selected
    if (form.valid && this.students.length > 0) {
      // Convert the start and end dates to the required format
      const startDate = this.convertDateFormat(form.value.start_date);
      const endDate = this.convertDateFormat(form.value.end_date);

      const student = this.students[0]; // Get the first student in the array

      
      // Extract CINs from the students array and convert them to numbers
      const studentCins = this.students.map(student => student.selectedStudentCin);
  
      // Create an internship data object with the necessary fields
      const internshipData = {
        start_date: startDate,
        end_date: endDate,
        status: form.value.status,
        evaluation: form.value.evaluation,
        classe_id: student.selectedStudentClassroomId,
        niveau_formation_id: student.selectedStudentTrainingTypeId,
        encadrant_id: 1 ,

        etudiants: studentCins,

        Etudiants :form.value.status,

        classRoom : form.value.status,
        trainingType : form.value.status,
        supervisor : form.value.status,
        etudiant1_cin : form.value.status ,
        etudiant2_cin : form.value.status ,

    };

    console.log("Data being sent to the API:", JSON.stringify(internshipData, null, 2));

  
      // Send the internship data to the backend service
      this.internshipService.addIntenship(internshipData).subscribe(
        () => {
          // On success, show a success message and reset the form
          this.popupMessageService.showPopupMessage('Stage ajouté avec succès!', 'success');
          this.successMessage = 'Stage ajouté avec succès!';
          this.errorMessage = null;
          form.resetForm();
          // Navigate to the internship list page
          this.router.navigate(['/internship-list']);
        },
        (error) => {
          // On error, log the error and show an error message
          console.error('Erreur lors de l ajout du Stage', error);
          this.popupMessageService.showPopupMessage('Erreur lors de l ajout du Stage', 'error');
          this.errorMessage = 'Erreur lors de l ajout du Stage!';
          this.successMessage = null;
        }
      );
    } else {
      // If the form is invalid or no students are selected, show an error message
      this.errorMessage = 'Formulaire invalide ou aucun étudiant sélectionné!';
      this.successMessage = null;
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
