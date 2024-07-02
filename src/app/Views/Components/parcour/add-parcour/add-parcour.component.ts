import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { ParcourService } from '../../../../Services/parcour.service';

@Component({
  selector: 'app-add-parcour',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-parcour.component.html',
  styleUrl: './add-parcour.component.css'
})
export class AddParcourComponent {
  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private parcourService: ParcourService ,private popupMessageService : PopupMessageService ,  router : Router) {}

  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const parcourData = {
        code_parcours: form.value.code,
        lib_parcours_fr: form.value.name,

      };

      this.parcourService.addParcour(parcourData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage(" Parcour ajouté avec succées !", 'success');

          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/parcour-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter le Parcour !", 'error');

          this.successMessage = null;
        }
      );
    } else {
      if (!form.value.name) {
        this.errorMessage = 'Le nom de Parcour est réquis!';
      }
    }
  }
}
