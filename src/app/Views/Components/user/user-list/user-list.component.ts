import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Department } from '../../../../Models/department';
import { DepartmentService } from '../../../../Services/department.service';
import { DialogService } from '../../../../Services/dialog.service';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { User } from '../../../../Models/user';
import { UserService } from '../../../../Services/user.service';

@Component({
  selector: 'app-user-list',
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
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  dtOptions: Config = {};

  users: User[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateUserForm') updateUserForm!: NgForm;

  selectedUser: User | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    router: Router,
    private dialogService: DialogService
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
        this.userService.getUsers().subscribe(
          (data: User[]) => {

            callback({
              data: data.map((user) => ({
                username : user.username,
                password: user.password,
                actions: this.renderActions(user),
              })),
            });
          },
          (error) => {
            console.error('Error fetching users', error);
          }
        );
      },
      columns: [
        {
          title: 'Nom d utilisateur ',
          data: 'username',
        },
        {
          title: 'Mot de Passe',
          data: 'password',
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
      const user_data = $(event.target).data('user');
      this.updateUserBtnClick(user_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const user_data = $(event.target).data('user');
      this.handleDelete(user_data);
    });
  }

  private renderActions(user: User): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-user='${JSON.stringify(
      user
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-user='${JSON.stringify(
      user
    )}'>
       Delete
     </button>
     `;
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching Users', error);
      }
    );
  }

  handleDelete(user: User): void {
    this.dialogService
      .showConfirmDialog(user.username)
      .then((confirmed) => {
        if (confirmed) {
          this.userService.deleteUser(user.user_id).subscribe(
            () => {
              window.location.reload(); // Refresh the page after deletion
              this.users = this.users.filter(
                (u) => u.user_id !== user.user_id
              );
            },
            (error) => {
              console.error('Error deleting user', error);
            }
          );
        }
      });
  }

  populateForm(): void {
    if (this.selectedUser) {
      const user = this.selectedUser;

      this.updateUserForm.form.patchValue({
        username: user.username,
        password: user.password,
      });
    }
  }

  updateUserBtnClick(user: User): void {
    this.selectedUser = user;
    
    this.populateForm();
    this.showUpdateForm = true;
    console.log("user selected : "+ this.selectedUser)
  }

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedUserData = {
        username: form.value.username,
        password: form.value.password,

      };

      this.userService
        .updateUser(
          this.selectedUser?.user_id,
          updatedUserData
        )
        .subscribe(
          () => {
            this.successMessage = 'L Utilisateur est modifiée avec succées!';
            this.errorMessage = null;
            this.showUpdateForm = false;
            window.location.reload();
          },
          (error) => {
            console.error('Error updating user', error);
            this.errorMessage = 'Erreur de modification l Utilisateur !';
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
    this.selectedUser = null;
  }

  AddUser() {
    this.router.navigate(['/user-list/add']);
  }
  
}
