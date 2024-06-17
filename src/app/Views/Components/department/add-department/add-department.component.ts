import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { DepartmentService } from '../../../../Services/department.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.css'
})
export class AddDepartmentComponent {

  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private departmentService: DepartmentService ,private popupMessageService : PopupMessageService ,  router : Router) {}

  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const departmentData = {
        code_departement: form.value.code,
        lib_departement_fr: form.value.name,

      };

      this.departmentService.addDepartment(departmentData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage(" Département ajouté avec succées !", 'success');

          this.successMessage = 'Département';
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/department-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter le Département !", 'error');

          this.errorMessage = "Impossible d'ajouter le Département !";
          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Le nom de Département est réquis!';
      }
    }
  }
}
