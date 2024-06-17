import { Component } from '@angular/core';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { Router } from '@angular/router';
import { TrainingService } from '../../../../Services/training.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';

@Component({
  selector: 'app-add-training',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.css'
})
export class AddTrainingComponent {


  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private trainingService: TrainingService , private popupMessageService : PopupMessageService,  router : Router) {}

  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const trainingData = {
        code_formation: form.value.code,
        lib_formation_fr: form.value.name,
        departement_id: form.value.name,
        department: form.value.name,

      };

      this.trainingService.addTraining(trainingData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage(" Formation ajouté avec succées !", 'success');

          this.successMessage = 'Formation ajouté avec succées !';
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/training-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage(" Impossible d'ajouter la Formation !", 'error');

          this.errorMessage = "Impossible d'ajouter la Formation !";
          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Le nom de formation est réquis!';
      }
    }
  }


}
