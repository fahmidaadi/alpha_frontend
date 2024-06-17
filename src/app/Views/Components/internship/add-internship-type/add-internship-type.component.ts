import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { InternshipTypeService } from '../../../../Services/internship-type.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';

@Component({
  selector: 'app-add-internship-type',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-internship-type.component.html',
  styleUrl: './add-internship-type.component.css'
})
export class AddInternshipTypeComponent {
  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private internshipTypeService: InternshipTypeService ,     private popupMessageService: PopupMessageService,
    router : Router) {}

  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const internshipTypeData = {
        lib_Type_Stage_fr: form.value.name,
        code_type_stage:form.value.code,

      };

      this.internshipTypeService.addInternshipType(internshipTypeData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage('Type de Stage ajouté avec succès!', 'success');

          this.successMessage = 'Type de Stage ajouté avec succées !';
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/internship-types-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter le type de stage !", 'error');

          this.errorMessage = "Impossible d'ajouter le type de stage !";
          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Le nom de type de stage est réquis!';
      }
      if (!form.value.code) {
        this.errorMessage = 'Le code de type de stage est réquis!';
      }
    }
  }
}
