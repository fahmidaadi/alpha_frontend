import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';

import { DialogService } from '../../../../Services/dialog.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { Supervisor } from '../../../../Models/supervisor';
import { SupervisorService } from '../../../../Services/supervisor.service';
import { Department } from '../../../../Models/department';
import { DepartmentService } from '../../../../Services/department.service';

@Component({
  selector: 'app-supervisor-list',
  standalone: true,
  imports: [DataTablesModule,
    InternshipDetailsButtonComponent,
    InternshipDetailsButtonComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    UiMessageComponent,
    ConfirmButtonComponent,
    AddButtonComponent,],
  templateUrl: './supervisor-list.component.html',
  styleUrl: './supervisor-list.component.css'
})
export class SupervisorListComponent {
  dtOptions: Config = {};

  supervisors: Supervisor[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateSupervisorForm') updateSupervisorForm!: NgForm;

  selectedSupervisor: Supervisor | null = null;
  loadedDepartments: Department[] = [];




  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private supervisorService: SupervisorService,
    router: Router,
    private dialogService: DialogService , 
    private departmentService : DepartmentService,
    private popupMessageService : PopupMessageService,
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
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
        this.supervisorService.getSupervisors().subscribe(
          (data: Supervisor[]) => {

            callback({
              data: data.map((supervisor) => ({
                supervisor_id : supervisor.supervisor_id,
                name: supervisor.name,
                department: supervisor.departement?.lib_departement_fr, 
                contact_info: supervisor.contact_info, 

                actions: this.renderActions(supervisor),
              })),
            });
          },
          (error) => {
            console.error('Error fetching supervisors', error);
          }
        );
      },
      columns: [
        {
          title: 'Id ',
          data: 'supervisor_id',
        },
        {
          title: 'Nom Encadrant',
          data: 'name',
        },
        {
          title: 'Département',
          data: 'department',
        },
        {
          title: 'Contact',
          data: 'contact_info',
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
      const supervisor_data = $(event.target).data('supervisor');
      this.updateSupervisorBtnClick(supervisor_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const supervisor_data = $(event.target).data('supervisor');
      this.handleDelete(supervisor_data);
    });
  }

  private renderActions(supervisor: Supervisor): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-supervisor='${JSON.stringify(
      supervisor
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-supervisor='${JSON.stringify(
      supervisor
    )}'>
       Delete
     </button>
     `;
  }

  getSupervisors() {
    this.supervisorService.getSupervisors().subscribe(
      (data: Supervisor[]) => {
        this.supervisors = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching Supervisors', error);
      }
    );
  }


  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (departments: Department[]) => {
        this.loadedDepartments = departments;
      },
      (error) => {
        console.error('Error fetching Departments', error);
        this.errorMessage = 'Error loading Departments!';
      }
    );
  }

  handleDelete(supervisor: Supervisor): void {
    this.dialogService
      .showConfirmDialog(supervisor.name)
      .then((confirmed) => {
        if (confirmed) {
          this.supervisorService.deleteSupervisor(supervisor.supervisor_id).subscribe(
            () => {
              window.location.reload();
              
              // Refresh the page after deletion
              this.supervisors = this.supervisors.filter(
                (s) => s.supervisor_id !== supervisor.supervisor_id
              );
              this.popupMessageService.showPopupMessage("Encadrant supprimé avec succées !", 'success');
            },
            (error) => {
              this.popupMessageService.showPopupMessage("Erreur lors de la suppression de Encadrant" , 'error');

              console.error('Error deleting departement', error);
            }
          );
        }
      });
  }

  populateForm(): void {
    if (this.selectedSupervisor) {
      const supervisor = this.selectedSupervisor;

      this.updateSupervisorForm.form.patchValue({
        name: supervisor.name,
        department: supervisor.departement_id,
        contact: supervisor.contact_info,

      });
    }
  }

  updateSupervisorBtnClick(supervisor: Supervisor): void {
    this.selectedSupervisor = supervisor;
    
    this.populateForm();
    this.showUpdateForm = true;
    console.log("supervisor selected : "+ this.selectedSupervisor)
  }

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedSupervisorData = {
        name: form.value.name,
        department: form.value.department,
        contact_info: form.value.contact,

      };

      this.supervisorService
        .updateSupervisor(
          this.selectedSupervisor?.supervisor_id,
          updatedSupervisorData
        )
        .subscribe(
          () => {
            this.successMessage = 'Encadrant est modifiée avec succées!';
            this.errorMessage = null;
            this.showUpdateForm = false;
            window.location.reload();

            this.popupMessageService.showPopupMessage("Encadrant Modifié avec succées !", 'success');

          },
          (error) => {
            this.popupMessageService.showPopupMessage("Erreur de modification de Encadrant !", 'error');

            console.error('Error updating supervisor', error);
            this.errorMessage = 'Erreur de modification de Encadrant !';
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
    this.selectedSupervisor = null;
  }

  AddSupervisor() {
    this.router.navigate(['/supervisor-list/add']);
  }
  
}
