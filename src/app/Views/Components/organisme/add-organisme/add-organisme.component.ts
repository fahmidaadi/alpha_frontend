import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../../Services/department.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { OrganismeService } from '../../../../Services/organisme.service';
import { CommonModule } from '@angular/common';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';

@Component({
  selector: 'app-add-organisme',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-organisme.component.html',
  styleUrl: './add-organisme.component.css'
})
export class AddOrganismeComponent {
  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private organismeService: OrganismeService ,private popupMessageService : PopupMessageService ,  router : Router) {}

  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const organismeData = {
        lib_organisme: form.value.name,
        tel: form.value.tel,
        fax: form.value.fax,
        adresse: form.value.adresse,


      };

      this.organismeService.addOrganisme(organismeData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage(" Organisem ajouté avec succées !", 'success');

          this.successMessage = 'Organisme';
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/organisme-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter Organisme !", 'error');

          this.errorMessage = "Impossible d'ajouter le Organisme !";
          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Le nom du Organisme est réquis!';
      }
    }
  }
}
