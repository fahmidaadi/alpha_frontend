import { Component, OnInit } from '@angular/core';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { StudentService } from '../../../../Services/student.service';
import { error } from 'jquery';
import { CommonModule } from '@angular/common';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { Router } from '@angular/router';
import { ClassRoom } from '../../../../Models/classRoom';
import { ClassService } from '../../../../Services/class.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';


@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [ConfirmButtonComponent, CommonModule, FormsModule, UiMessageComponent],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent implements OnInit {
  day: string = '';
  month: string = '';
  year: string = '';

  loadedClassRooms: ClassRoom[] = [];

  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private studentService: StudentService, router: Router, private popupMessageService : PopupMessageService , private classRoomService: ClassService) { }

  ngOnInit(): void {
    this.loadClassRooms();
  }

  
  private loadClassRooms(): void {
    this.classRoomService.getClassRooms().subscribe(
      (classRooms: ClassRoom[]) => {
        this.loadedClassRooms = classRooms;
      },
      (error) => {
        console.error('Error fetching classRooms', error);
        this.errorMessage = 'Error loading ClassRooms!';
      }
    );
  }


  onSubmit(form: NgForm) {
    if (form.valid) {
      const { cin, name, email, phone_nbr, classe } = form.value;

      // Combine day, month, and year into a valid date format
      const dateOfBirth = this.formatDateOfBirth(this.day, this.month, this.year);

      if (dateOfBirth) {
        const studentData = {
          cin,
          name,
          email,
          phone_nbr,
          classe_id: classe,
          classRoom: classe,
          dte_naiss: dateOfBirth,
        };

        this.studentService.addStudent(studentData).subscribe(
          (response) => {
            this.popupMessageService.showPopupMessage(" Stagaire ajouté avec succées !", 'success');

            this.successMessage = 'Stagaire ajouté avec succès!';
            this.errorMessage = null;
            form.resetForm();
            this.router.navigate(['/student-list']);
          },
          (error) => {
            this.popupMessageService.showPopupMessage(" Erreur lors de l'ajout du Stagaire!", 'error');

            this.errorMessage = 'Erreur lors de l\'ajout du stagaire!';
            this.successMessage = null;
          }
        );
      } else {
        this.errorMessage = 'Date de naissance invalide!';
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis!';
    }
  }

  // Format and validate the date
  formatDateOfBirth(day: string, month: string, year: string): string | null {
    // Check if all fields are provided
    if (!day || !month || !year) {
      return null;
    }

    // Pad day and month with leading zeros if necessary
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');
    const paddedYear = year;

    // Create a date string in the format yyyy/MM/dd
    const dateString = `${paddedYear}/${paddedMonth}/${paddedDay}`;

    // Validate the date
    const date = new Date(dateString);
    if (
      date &&
      date.getFullYear() === parseInt(paddedYear, 10) &&
      date.getMonth() + 1 === parseInt(paddedMonth, 10) &&
      date.getDate() === parseInt(paddedDay, 10)
    ) {
      return dateString;
    } else {
      return null;
    }
  }

  }
