import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { CollegeYear } from '../../../../Models/college-year';
import { CollegeYearService } from '../../../../Services/college-year.service';
import { DialogService } from '../../../../Services/dialog.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { UserType } from '../../../../Models/user-type';
import { UserTypeService } from '../../../../Services/user-type.service';

@Component({
  selector: 'app-user-type-list',
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
  templateUrl: './user-type-list.component.html',
  styleUrl: './user-type-list.component.css'
})
export class UserTypeListComponent {
  dtOptions: Config = {};

  userTypes: UserType[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateUserTypeForm') updateUserTypeForm!: NgForm;

  selectedUserType: UserType | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private userTypeService: UserTypeService,
    router: Router,
    private dialogService: DialogService,
    private popupMessageService: PopupMessageService,
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
        this.userTypeService.getUserTypes().subscribe(
          (data: UserType[]) => {

            callback({
              data: data.map((userType) => ({
                user_type_id: userType.user_type_id,
                lib_user_type: userType.lib_user_type,
                actions: this.renderActions(userType),
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
          title: 'Id',
          data: 'user_type_id',
        },
        {
          title: 'Libellé Type Utilisateur',
          data: 'lib_user_type',
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
      const userType_data = $(event.target).data('userType');
      this.updateUserTypeBtnClick(userType_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const userType_data = $(event.target).data('userType');
      this.handleDelete(userType_data);
    });
  }

  private renderActions(userType: UserType): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-user-type='${JSON.stringify(
      userType
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-user-type='${JSON.stringify(
      userType
    )}'>
       Delete
     </button>
     `;
  }

  getUserTypes() {
    this.userTypeService.getUserTypes().subscribe(
      (data: UserType[]) => {
        this.userTypes = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching UserTypes', error);
      }
    );
  }

  handleDelete(userType: UserType): void {
    this.dialogService
      .showConfirmDialog(userType.lib_user_type)
      .then((confirmed) => {
        if (confirmed) {
          this.userTypeService.deleteUserType(userType.user_type_id).subscribe(
            () => {
              window.location.reload();

              // Refresh the page after deletion
              this.userTypes = this.userTypes.filter(
                (c) => c.user_type_id !== userType.user_type_id
              );
              this.popupMessageService.showPopupMessage("Type Utilisateur supprimé avec succées !", 'success');
            },
            (error) => {
              this.popupMessageService.showPopupMessage("Erreur lors de la suppression de Type Utilisateur", 'error');

              console.error('Error deleting departement', error);
            }
          );
        }
      });
  }

  populateForm(): void {
    if (this.selectedUserType) {
      const userType = this.selectedUserType;

      this.updateUserTypeForm.form.patchValue({
        name: userType.lib_user_type,
      });
    }
  }

  updateUserTypeBtnClick(userType: UserType): void {
    this.selectedUserType = userType;
    this.populateForm();
    this.showUpdateForm = true;
  }
  

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedUserTypeData = {
        lib_user_type: form.value.name,
      };

      this.userTypeService
        .updateUserType(
          this.selectedUserType?.user_type_id,
          updatedUserTypeData
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
            this.popupMessageService.showPopupMessage("Erreur de modification de Type Utilisateur !", 'error');

            console.error('Error updating userType', error);
            this.errorMessage = 'Erreur de modification de Type Utilisateur !';
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
    this.selectedUserType = null;
  }

  AddUserType() {
    this.router.navigate(['/user-type-list/add']);
  }
}
