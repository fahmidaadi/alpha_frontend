import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingService } from '../../../../Services/training.service';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { TrainingTypeService } from '../../../../Services/training-type.service';
import { Training } from '../../../../Models/training';
import { InternshipType } from '../../../../Models/internship-type';
import { InternshipTypeService } from '../../../../Services/internship-type.service';
import { PopupMessageComponent } from '../../../Shared/popup-message/popup-message.component';
import { PopupMessageService } from '../../../../Services/popup-message.service';

@Component({
  selector: 'app-add-training-types',
  standalone: true,
  imports: [
    ConfirmButtonComponent,
    CommonModule,
    FormsModule,
    UiMessageComponent,
  ],
  templateUrl: './add-training-types.component.html',
  styleUrl: './add-training-types.component.css',
})
export class AddTrainingTypesComponent implements OnInit {
  router: Router = new Router();

  loadedTrainings: Training[] = [];
  loadedInternshipTypes: InternshipType[] = [];

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private trainingTypesService: TrainingTypeService,
    private trainingService: TrainingService,
    private internshipTypeService: InternshipTypeService,
    private popupMessageService : PopupMessageService , 
    router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
    this.loadInternshipTypes();
  }

  private loadTrainings(): void {
    this.trainingService.getTrainings().subscribe(
      (trainings: Training[]) => {
        this.loadedTrainings = trainings;
      },
      (error) => {
        console.error('Error fetching trainings', error);
        this.errorMessage = 'Error loading trainings!';
      }
    );
  }
  private loadInternshipTypes(): void {
    this.internshipTypeService.getInternshipTypes().subscribe(
      (InternshipTypes: InternshipType[]) => {
        this.loadedInternshipTypes = InternshipTypes;
      },
      (error) => {
        console.error('Error fetching internshipTypes', error);
        this.errorMessage = 'Error loading internshipTypes!';
      }
    );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const trainingTypeData = {
        code_niveau_formation: form.value.code,
        lib_niveau_formation_fr: form.value.name,
        formation_id: form.value.training,
        training: form.value.training,
        type_stage_id: form.value.internshipType,
        internshipType : form.value.internshipType,
      };

      this.trainingTypesService.addTrainingType(trainingTypeData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage("Niveau de Formation ajouté avec succées !", 'success');

          this.successMessage = 'Niveau de Formation ajouté avec succées !';
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/training-type-list']);
        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter le niveau Formation !", 'error');

          this.errorMessage = "Impossible d'ajouter le niveau Formation !";
          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Le niveau formation est réquis!';
      }
    }
  }
}
