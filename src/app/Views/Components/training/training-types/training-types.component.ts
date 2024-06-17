import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Config } from 'datatables.net';
import { TrainingType } from '../../../../Models/training-type';
import { TrainingTypeService } from '../../../../Services/training-type.service';
import { DialogService } from '../../../../Services/dialog.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { Training } from '../../../../Models/training';
import { Observable, forkJoin, map } from 'rxjs';
import { TrainingService } from '../../../../Services/training.service';
import { InternshipTypeService } from '../../../../Services/internship-type.service';
import { InternshipType } from '../../../../Models/internship-type';

@Component({
  selector: 'app-training-types',
  templateUrl: './training-types.component.html',
  styleUrls: ['./training-types.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    HttpClientModule,
    AddButtonComponent,
    ConfirmButtonComponent,
    UiMessageComponent,
    InternshipDetailsButtonComponent,
  ],
})
export class TrainingTypesComponent implements OnInit {
  selectedTrainingType: TrainingType | null = null;
  loadedTrainings: Training[] = [];
  loadedInternshipTypes: InternshipType[] = [];

  trainingTypes: TrainingType[] = [];
  trainings: Training[] = [];
  internshipTypes: InternshipType[] = [];

  
  
  dtOptions: Config = {};
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showUpdateForm: boolean = false;

  @ViewChild('updateTrainingTypeForm') updateTrainingTypeForm!: NgForm;

  constructor(
    private trainingTypeService: TrainingTypeService,
    private trainingService: TrainingService,
    private internshipTypeService : InternshipTypeService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrainings();
    this.loadInternshipTypes();

    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.trainingTypeService.getTrainingTypes().subscribe(
          (data: TrainingType[]) => {
            const formattedData = data.map((trainingType) => {
              return {
                niveau_formation_id: trainingType.niveau_formation_id,
                code_niveau_formation: trainingType.code_niveau_formation,
                lib_niveau_formation_fr: trainingType.lib_niveau_formation_fr,
                formation: trainingType.training.lib_formation_fr,
                internshipType: trainingType.internshipType.lib_Type_Stage_fr,
                actions: this.renderActions(trainingType),

              };
            });

            callback({ data: formattedData });
          },
          (error) => {
            console.error('Error fetching training types', error);
          }
        );
      },
      columns: [
        { title: 'Code niveau de formation', data: 'code_niveau_formation' },
        { title: 'Niveau de Formation', data: 'lib_niveau_formation_fr' },
        { title: 'Formation', data: 'formation' },
        { title: 'Type de Stage' , data : 'internshipType'},
        {
          title: 'Actions',
          data: 'actions',
          orderable: false,
          render: (data: any) => data,
        },
      ],
    };

    $(document).on('click', '.update-btn', (event) => {
      const training_type_data = $(event.target).data('trainingType');
      this.onUpdateButtonClick(training_type_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const training_type_data = $(event.target).data('trainingType');
      this.handleDelete(training_type_data);
    });
  }

  private renderActions(trainingType: TrainingType): string {
    return `
            <button class="btn btn-sm btn-warning update-btn" data-training-type='${JSON.stringify(
              trainingType
            )}'>
                Update
            </button>
            <button class="btn btn-sm btn-danger delete-btn" data-training-type='${JSON.stringify(
              trainingType
            )}'>
                Delete
            </button>
        `;
  }


  onUpdateButtonClick(trainingType: TrainingType): void {
    this.selectedTrainingType = trainingType;
    console.log("selected trainingType : " + this.selectedTrainingType);
    console.log("trainingType : " + trainingType);
    this.showUpdateForm = true;
    this.populateForm(trainingType);
  }

  handleDelete(trainingType: TrainingType): void {
    this.dialogService
      .showConfirmDialog(trainingType.lib_niveau_formation_fr)
      .then((confirmed) => {
        if (confirmed) {
          this.trainingTypeService
            .deleteTrainingType(trainingType.niveau_formation_id)
            .subscribe(
              () => {
                window.location.reload(); // Refresh the page after deletion
                this.trainingTypes = this.trainingTypes.filter(
                  (t) =>
                    t.niveau_formation_id !== trainingType.niveau_formation_id
                );
              },
              (error) => {
                console.error('Error deleting student', error);
              }
            );
        }
      });
  }

  private populateForm(trainingType: TrainingType): void {
    if (this.updateTrainingTypeForm) {
      this.updateTrainingTypeForm.form.patchValue({
        code: trainingType.code_niveau_formation,
        name: trainingType.lib_niveau_formation_fr,
        training: trainingType.training.formation_id,
        internshipType: trainingType.type_stage_id,

      });
    }
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
      (internshipTypes: InternshipType[]) => {
        this.loadedInternshipTypes = internshipTypes;
      },
      (error) => {
        console.error('Error fetching internshipTypes', error);
        this.errorMessage = 'Error loading internshipTypes!';
      }
    );
  }


  onFormSubmit(form: NgForm): void {
    if (form.valid && this.selectedTrainingType) {
      const updatedTrainingType: Partial<TrainingType> = {
        code_niveau_formation: form.value.code,
        lib_niveau_formation_fr: form.value.name,
        formation_id: form.value.training,
        type_stage_id: form.value.internshipType
      };

      this.trainingTypeService
        .updateTrainingType(
          this.selectedTrainingType.niveau_formation_id,
          updatedTrainingType
        )
        .subscribe(
          () => {
            this.successMessage = 'Training type updated successfully!';
            this.showUpdateForm = false;
            window.location.reload();
          },
          (error) => {
            console.error('Error updating training type', error);
            this.errorMessage = 'Error updating training type!';
          }
        );
    } else {
      this.errorMessage = 'Please fill in the required fields!';
    }
  }

  onCancel(): void {
    this.showUpdateForm = false;
    this.selectedTrainingType = null;
  }

  onAddTrainingClick(): void {
    this.router.navigate(['/training-types/add']);
  }
}
