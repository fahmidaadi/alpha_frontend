import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../../Services/department.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { CommonModule } from '@angular/common';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { CollegeYearService } from '../../../../Services/college-year.service';

@Component({
  selector: 'app-add-college-year',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-college-year.component.html',
  styleUrl: './add-college-year.component.css'
})
export class AddCollegeYearComponent {
  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private collegeYearService: CollegeYearService ,private popupMessageService : PopupMessageService ,  router : Router) {}

  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const collegeYearData = {
        annee_universitaire: form.value.name,

      };

      this.collegeYearService.addCollegeYear(collegeYearData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage(" Année Universitaire ajouté avec succées !", 'success');

          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/college-year-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter le Année Universitaire !", 'error');

          this.errorMessage = "Impossible d'ajouter le Année Universitaire !";
          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Libellé Année Universitaire est réquis!';
      }
    }
  }
}
