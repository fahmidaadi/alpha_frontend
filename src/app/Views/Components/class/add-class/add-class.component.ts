import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Training } from '../../../../Models/training';
import { TrainingTypeService } from '../../../../Services/training-type.service';
import { TrainingService } from '../../../../Services/training.service';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { ClassService } from '../../../../Services/class.service';
import { TrainingType } from '../../../../Models/training-type';
import { PopupMessageService } from '../../../../Services/popup-message.service';

@Component({
  selector: 'app-add-class',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-class.component.html',
  styleUrl: './add-class.component.css'
})
export class AddClassComponent {
  router: Router = new Router();

  loadedTrainingTypes: TrainingType[] = []; 


  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private trainingTypesService: TrainingTypeService ,  private classRoomService : ClassService, private popupMessageService : PopupMessageService, router : Router) {}

  ngOnInit(): void {
    this.loadTrainingTypes();

  }

  private loadTrainingTypes(): void {
    this.trainingTypesService.getTrainingTypes().subscribe(
      (trainingTypes: TrainingType[]) => {
        this.loadedTrainingTypes = trainingTypes; 
      },
      (error) => {
        console.error('Error fetching trainings', error);
        this.errorMessage = 'Error loading training Types!';
      }
    );
  }  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const ClassRoomData = {
        code_classe: form.value.code,
        lib_classe_fr: form.value.name,
        niveau_formation_id : form.value.trainingType,
        trainingType : form.value.trainingType,
      };

      this.classRoomService.addClassRoom(ClassRoomData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage('Classe ajouté avec succès!', 'success');

          this.successMessage = 'Classe ajouté avec succées !';
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/classes-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter la Classe !", 'error');

          this.errorMessage = "Impossible d'ajouter la Classe !";
          this.successMessage = null;
        }
      );
    } else {

      if (!form.value.name) {
        this.errorMessage = 'Le nom de Classe est réquis!';
      }
    }
  }

}
