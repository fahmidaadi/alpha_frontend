import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Training } from '../../../../Models/training';
import { TrainingType } from '../../../../Models/training-type';
import { DialogService } from '../../../../Services/dialog.service';
import { TrainingTypeService } from '../../../../Services/training-type.service';
import { TrainingService } from '../../../../Services/training.service';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { ClassRoom } from '../../../../Models/classRoom';
import { ClassService } from '../../../../Services/class.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';

@Component({
  selector: 'app-class-list',
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
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.css',
})
export class ClassListComponent {
  selectedClassRoom: ClassRoom | null = null;
  loadedTrainingTypes: TrainingType[] = [];

  classRooms: ClassRoom[] = [];
  trainingTypes: TrainingType[] = [];

  dtOptions: Config = {};
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showUpdateForm: boolean = false;

  @ViewChild('updateClassRoomForm') updateClassRoomForm!: NgForm;

  constructor(
    private trainingTypeService: TrainingTypeService,
    private classRoomService: ClassService,
    private dialogService: DialogService,
    private popupMessageService : PopupMessageService ,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrainingTypes();

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
        this.classRoomService.getClassRooms().subscribe(
          (data: ClassRoom[]) => {
            const formattedData = data.map((classRoom) => {
              return {
                classe_id: classRoom.classe_id,
                code_classe: classRoom.code_classe,
                lib_classe_fr: classRoom.lib_classe_fr,
                niveau_formation: classRoom.trainingType.lib_niveau_formation_fr,
                actions: this.renderActions(classRoom),
              };
            });

            callback({ data: formattedData });
          },
          (error) => {
            console.error('Error fetching ClassRoom', error);
          }
        );
      },
      columns: [
        { title: 'Code', data: 'code_classe' },
        { title: 'Libellé du Classe', data: 'lib_classe_fr' },
        { title: 'Niveau de Formation', data: 'niveau_formation' },
        {
          title: 'Actions',
          data: 'actions',
          orderable: false,
          render: (data: any) => data,
        },
      ],
    };

    $(document).on('click', '.update-btn', (event) => {
      const class_room_data = $(event.target).data('classRoom');
      this.onUpdateButtonClick(class_room_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const class_room_data = $(event.target).data('classRoom');
      this.handleDelete(class_room_data);
    });
  }

  private renderActions(classRoom: ClassRoom): string {
    return `
            <button class="btn btn-sm btn-warning update-btn" data-class-room='${JSON.stringify(
              classRoom
            )}'>
                Update
            </button>
            <button class="btn btn-sm btn-danger delete-btn" data-class-room='${JSON.stringify(
              classRoom
            )}'>
                Delete
            </button>
        `;
  }




  onUpdateButtonClick(classRoom: ClassRoom): void {
    this.selectedClassRoom = classRoom;
    this.showUpdateForm = true;
    this.populateForm(classRoom);
    
  }

  handleDelete(classRoom: ClassRoom): void {
    this.dialogService
      .showConfirmDialog(classRoom.lib_classe_fr)
      .then((confirmed) => {
        if (confirmed) {
          this.classRoomService
          .deleteClassRoom(classRoom.classe_id)
          .subscribe(
            () => {
              
              window.location.reload(); // Refresh the page after deletion
              this.popupMessageService.showPopupMessage("Classe supprimé avec succées !", 'success');
              this.classRooms = this.classRooms.filter(
                (c) => c.classe_id !== classRoom.classe_id
              );
            },
            (error) => {
              this.popupMessageService.showPopupMessage("Erreur lors de la suppression de Classe" , 'error');

              console.error('Error deleting ClassRoom', error);
            }
          );
        }
      });
  }

  private populateForm(classRoom: ClassRoom): void {
    if (this.updateClassRoomForm) {
      this.updateClassRoomForm.form.patchValue({
        code: classRoom.code_classe,
        name: classRoom.lib_classe_fr,
        trainingType: classRoom.trainingType.niveau_formation_id,
        });
    }
  }

  private loadTrainingTypes(): void {
    this.trainingTypeService.getTrainingTypes().subscribe(
      (trainingTypes: TrainingType[]) => {
        this.loadedTrainingTypes = trainingTypes;
      },
      (error) => {
        console.error('Error fetching trainingTypes', error);
        this.errorMessage = 'Error loading trainingTypes!';
      }
    );
  }

  onFormSubmit(form: NgForm): void {
    if (form.valid && this.selectedClassRoom) {
      const updatedClassRoom: Partial<ClassRoom> = {
        code_classe: form.value.code,
        lib_classe_fr: form.value.name,
        niveau_formation_id: form.value.trainingType,
        trainingType: form.value.trainingType,
      };

      this.classRoomService
        .updateClassRoom(
          this.selectedClassRoom.classe_id, 
          updatedClassRoom)
        .subscribe(
          () => {
            
            this.successMessage = 'ClassRoom updated successfully!';
            this.showUpdateForm = false;
            window.location.reload();
            this.popupMessageService.showPopupMessage("Classe modifié avec succées !", 'success');
            
          },
          (error) => {
            this.popupMessageService.showPopupMessage("Erreur de modification de Classe !", 'error');
            
            console.error('Error updating ClassRoom', error);
            this.errorMessage = 'Error updating training type!';
          }
        );
    } else {
      this.errorMessage = 'Please fill in the required fields!';
    }
  }

  onCancel(): void {
    this.showUpdateForm = false;
    this.selectedClassRoom = null;
  }

  onAddTrainingClick(): void {
    this.router.navigate(['/classes-list/add']);
  }
}
