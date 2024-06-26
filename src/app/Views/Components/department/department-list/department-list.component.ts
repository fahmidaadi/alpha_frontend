import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Training } from '../../../../Models/training';
import { DialogService } from '../../../../Services/dialog.service';
import { TrainingService } from '../../../../Services/training.service';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { DepartmentService } from '../../../../Services/department.service';
import { Department } from '../../../../Models/department';
import { PopupMessageService } from '../../../../Services/popup-message.service';

@Component({
  selector: 'app-department-list',
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
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent {
  dtOptions: Config = {};

  departments: Department[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateDepartmentForm') updateDepartmentForm!: NgForm;

  selectedDepartment: Department | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private departmentService: DepartmentService,
    router: Router,
    private dialogService: DialogService , 
    private popupMessageService : PopupMessageService,
  ) { }

  ngOnInit(): void {
    
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
        this.departmentService.getDepartments().subscribe(
          (data: Department[]) => {

            callback({
              data: data.map((department) => ({
                departement_id : department.departement_id,
                code_departement: department.code_departement,
                lib_departement_fr: department.lib_departement_fr, 
                actions: this.renderActions(department),
              })),
            });
          },
          (error) => {
            console.error('Error fetching trainings', error);
          }
        );
      },
      columns: [
        {
          title: 'Code',
          data: 'code_departement',
        },
        {
          title: 'Libellé Département',
          data: 'lib_departement_fr',
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
      const department_data = $(event.target).data('department');
      this.updateDepartmentBtnClick(department_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const department_data = $(event.target).data('department');
      this.handleDelete(department_data);
    });
  }

  private renderActions(department: Department): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-department='${JSON.stringify(
      department
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-department='${JSON.stringify(
      department
    )}'>
       Delete
     </button>
     `;
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe(
      (data: Department[]) => {
        this.departments = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching Departments', error);
      }
    );
  }

  handleDelete(department: Department): void {
    this.dialogService
      .showConfirmDialog(department.lib_departement_fr)
      .then((confirmed) => {
        if (confirmed) {
          this.departmentService.deleteDepartment(department.departement_id).subscribe(
            () => {
              window.location.reload();
              
              // Refresh the page after deletion
              this.departments = this.departments.filter(
                (d) => d.departement_id !== department.departement_id
              );
              this.popupMessageService.showPopupMessage("Departement supprimé avec succées !", 'success');
            },
            (error) => {
              this.popupMessageService.showPopupMessage("Erreur lors de la suppression de Département" , 'error');

              console.error('Error deleting departement', error);
            }
          );
        }
      });
  }

  populateForm(): void {
    if (this.selectedDepartment) {
      const department = this.selectedDepartment;

      this.updateDepartmentForm.form.patchValue({
        code: department.code_departement,
        name: department.lib_departement_fr,
      });
    }
  }

  updateDepartmentBtnClick(department: Department): void {
    this.selectedDepartment = department;
    
    this.populateForm();
    this.showUpdateForm = true;
    console.log("department selected : "+ this.selectedDepartment)
  }

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedDepartmentData = {
        code_departement: form.value.code,
        lib_departement_fr: form.value.name,

      };

      this.departmentService
        .updateDepartment(
          this.selectedDepartment?.departement_id,
          updatedDepartmentData
        )
        .subscribe(
          () => {
            this.successMessage = 'Le département est modifiée avec succées!';
            this.errorMessage = null;
            this.showUpdateForm = false;
            window.location.reload();

            this.popupMessageService.showPopupMessage("Departement Modifié avec succées !", 'success');

          },
          (error) => {
            this.popupMessageService.showPopupMessage("Erreur de modification de Départment !", 'error');

            console.error('Error updating department', error);
            this.errorMessage = 'Erreur de modification de Départment !';
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
    this.selectedDepartment = null;
  }

  AddDepartment() {
    this.router.navigate(['/department-list/add']);
  }
  
}
