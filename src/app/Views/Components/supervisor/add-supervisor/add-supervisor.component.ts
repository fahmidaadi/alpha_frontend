import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, NgForm } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CollegeYear } from '../../../../Models/college-year';
import { Department } from '../../../../Models/department';
import { CollegeYearService } from '../../../../Services/college-year.service';
import { DepartmentService } from '../../../../Services/department.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { TrainingService } from '../../../../Services/training.service';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { SupervisorService } from '../../../../Services/supervisor.service';

@Component({
  selector: 'app-add-supervisor',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent ,ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule ],
  templateUrl: './add-supervisor.component.html',
  styleUrl: './add-supervisor.component.css'
})
export class AddSupervisorComponent {

  loadedDepartments: Department[] = [];



  router: Router = new Router();

  
  
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private supervisorService : SupervisorService ,private departmentService : DepartmentService ,    private popupMessageService : PopupMessageService,  router : Router) {}

   ngOnInit(): void {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (departments: Department[]) => {
        this.loadedDepartments = departments;
      },
      (error) => {
        console.error('Error fetching departments', error);
        this.errorMessage = 'Error loading departments!';
      }
    );
  }

  
 

  onSubmit(form: NgForm) {
    if (form.valid) {
      const supervisorData = {
        name: form.value.name,
        contact_info: form.value.contact,
        departement_id : form.value.department,
        email : form.value.email, 
      };

      

      this.supervisorService.addSupervisor(supervisorData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage(" Encadrant ajouté avec succées !", 'success');
          console.log(JSON.stringify(supervisorData))

          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/supervisor-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage(" Impossible d'ajouter Encadrant !", 'error');

          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Le nom d Encadrant est réquis!';
      }
    }
  }
}
