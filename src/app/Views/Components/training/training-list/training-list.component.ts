import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { Training } from '../../../../Models/training';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { DialogService } from '../../../../Services/dialog.service';
import { TrainingService } from '../../../../Services/training.service';
import { Config } from 'datatables.net';
import { Department } from '../../../../Models/department';
import { DepartmentService } from '../../../../Services/department.service';
import { CollegeYear } from '../../../../Models/college-year';
import { CollegeYearService } from '../../../../Services/college-year.service';

@Component({
  selector: 'app-training-list',
  standalone: true,
  imports: [
    DataTablesModule,
    InternshipDetailsButtonComponent,
    InternshipDetailsButtonComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    UiMessageComponent,
    ConfirmButtonComponent,
    AddButtonComponent,
  ],
  templateUrl: './training-list.component.html',
  styleUrl: './training-list.component.css',
})
export class TrainingListComponent implements OnInit {
  loadedDepartments : Department[] = [];
  loadedCollegeYears : CollegeYear[] = [];
  
  dtOptions: Config = {};

  trainings: Training[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateTrainingForm') updateTrainingForm!: NgForm;

  selectedTraining: Training | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private trainingService: TrainingService,
    router: Router,
    private dialogService: DialogService,
    private departmentService : DepartmentService,
    private collegeYearService: CollegeYearService,
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCollegeYears();

    this.dtOptions = {

      language: {
        "emptyTable": "Aucune donnée disponible dans le tableau",
    "loadingRecords": "Chargement...",
    "processing": "Traitement...",
    "decimal": ",",
    "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
    "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
    "infoFiltered": "(filtrées depuis un total de _MAX_ entrées)",
    "lengthMenu": "Afficher _MENU_ entrées",
    "paginate": {
        "first": "Première",
        "last": "Dernière",
        "next": "Suivante",
        "previous": "Précédente"
    },
    "zeroRecords": "Aucune entrée correspondante trouvée",
    "aria": {
        "sortAscending": " : activer pour trier la colonne par ordre croissant",
        "sortDescending": " : activer pour trier la colonne par ordre décroissant"
    },
    "search": "Rechercher :",
    "thousands": " "   
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.trainingService.getTrainings().subscribe(
          (data: Training[]) => {
            const formattedData = data.map((training) => {
              return {
                code_formation: training.code_formation,
                lib_formation_fr: training.lib_formation_fr,
                department: training.department.lib_departement_fr,
                annee_universitaire : training.collegeYear.annee_universitaire,
                actions: this.renderActions(training),
              };
            });

            callback({ data: formattedData });
          },
          (error) => {
            console.error('Error fetching trainings', error);
          }
        );
      },
      columns: [
        {
          title: 'Code',
          data: 'code_formation',
        },
        {
          title: 'Libellé Formation',
          data: 'lib_formation_fr',
        },
        {
          title: 'Département',
          data: 'department',
        },
        {
          title: 'Année Universitaire',
          data: 'annee_universitaire',
        },
        {
          title: 'Actions',
          data: 'actions',
          orderable: false,
          render: (data: any, type: any, row: any) => {
            return data;
          },
        },
      ],
    };

    $(document).on('click', '.update-btn', (event) => {
      const training_data = $(event.target).data('training');
      this.updateTrainingBtnClick(training_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const training_data = $(event.target).data('training');
      this.handleDelete(training_data);
    });
  }

  private renderActions(training: Training): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-training='${JSON.stringify(
      training 	
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-training='${JSON.stringify(
      training
    )}'>
       Delete 
     </button>
     `;
  }

  getTrainings() {
    this.trainingService.getTrainings().subscribe(
      (data: Training[]) => {
        this.trainings = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching Trainings', error);
      }
    );
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

  private loadCollegeYears(): void {
    this.collegeYearService.getCollegeYears().subscribe(
      (collegeYears: CollegeYear[]) => {
        this.loadedCollegeYears = collegeYears;
      },
      (error) => {
        console.error('Error fetching collegeYears', error);
        this.errorMessage = 'Error loading CollegeYears!';
      }
    );
  }
    

  handleDelete(training: Training): void {
    this.dialogService
      .showConfirmDialog(training.lib_formation_fr)
      .then((confirmed) => {
        if (confirmed) {
          this.trainingService.deleteTraining(training.formation_id).subscribe(
            () => {
              window.location.reload(); // Refresh the page after deletion
              this.trainings = this.trainings.filter(
                (t) => t.formation_id !== training.formation_id
              );
            },
            (error) => {
              console.error('Error deleting student', error);
            }
          );
        }
      });
  }

  populateForm(): void {
    if (this.selectedTraining) {
      const training = this.selectedTraining;

      this.updateTrainingForm.form.patchValue({
        code: training.code_formation,
        name: training.lib_formation_fr,
        departement : training.departement_id,
        collegeYear : training.annee_universitaire_id
      });
    }
  }

  updateTrainingBtnClick(training: Training): void {
    this.selectedTraining = training;
    this.populateForm();
    this.showUpdateForm = true;
  }

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedTrainingData = {
        code_formation: form.value.code,
        lib_formation_fr: form.value.name,
        departement_id : form.value.departement,
        annee_universitaire_id : form.value.collegeYear

      };

      this.trainingService
        .updateTraining(
          this.selectedTraining?.formation_id,
          updatedTrainingData
        )
        .subscribe(
          () => {
            this.successMessage = 'La Formation est modifiée avec succées!';
            this.errorMessage = null;
            this.showUpdateForm = false;
            window.location.reload();
          },
          (error) => {
            console.error('Error updating training', error);
            this.errorMessage = 'Erreur de modification de formation !';
            this.successMessage = null;
          }
        );
    } else {
      this.errorMessage = 'SVP , remplissez les champs requis!';
      this.successMessage = null;
    }
  }

  onCancel(): void {
    this.showUpdateForm = false;
    this.selectedTraining = null;
  }

  AddTraining() {
    this.router.navigate(['/training-list/add']);
  }
}
