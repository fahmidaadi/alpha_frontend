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
import { OrganismeService } from '../../../../Services/organisme.service';
import { Organisme } from '../../../../Models/organisme';

@Component({
  selector: 'app-organisme-list',
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
  templateUrl: './organisme-list.component.html',
  styleUrl: './organisme-list.component.css'
})
export class OrganismeListComponent {
  dtOptions: Config = {};

  organismes: Organisme[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateOrganismeForm') updateOrganismeForm!: NgForm;

  selectedOrganisme: Organisme | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private organismeService: OrganismeService,
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
        this.organismeService.getOrganismes().subscribe(
          (data: Organisme[]) => {

            callback({
              data: data.map((organisme) => ({
                organisme_id : organisme.organisme_id,
                lib_organisme: organisme.lib_organisme,
                tel: organisme.tel, 
                fax : organisme.fax,
                adresse : organisme.adresse,
                actions: this.renderActions(organisme),
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
          title: 'Id ',
          data: 'organisme_id',
        },
        {
          title: 'Libellé Organisme',
          data: 'lib_organisme',
        },
        {
          title: 'Téléphone Organisme',
          data: 'tel',
        },
        {
          title: 'Fax Organisme',
          data: 'fax',
        },
        {
          title: 'Adresse Organisme',
          data: 'adresse',
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
      const organisme_data = $(event.target).data('organisme');
      this.updateOrganismeBtnClick(organisme_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const organisme_data = $(event.target).data('organisme');
      this.handleDelete(organisme_data);
    });
  }

  private renderActions(organisme: Organisme): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-organisme='${JSON.stringify(
      organisme
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-organisme='${JSON.stringify(
      organisme
    )}'>
       Delete
     </button>
     `;
  }

  getOrganismes() {
    this.organismeService.getOrganismes().subscribe(
      (data: Organisme[]) => {
        this.organismes = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching Organismes', error);
      }
    );
  }

  handleDelete(organisme: Organisme): void {
    this.dialogService
      .showConfirmDialog(organisme.lib_organisme)
      .then((confirmed) => {
        if (confirmed) {
          this.organismeService.deleteOrganisme(organisme.organisme_id).subscribe(
            () => {
              window.location.reload();
              
              // Refresh the page after deletion
              this.organismes = this.organismes.filter(
                (o) => o.organisme_id !== organisme.organisme_id
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
    if (this.selectedOrganisme) {
      const organisme = this.selectedOrganisme;

      this.updateOrganismeForm.form.patchValue({
        name: organisme.lib_organisme,
        tel: organisme.tel,
        fax: organisme.fax,
        adresse: organisme.adresse,

      });
    }
  }

  updateOrganismeBtnClick(organisme: Organisme): void {
    this.selectedOrganisme = organisme;
    
    this.populateForm();
    this.showUpdateForm = true;
    console.log("organisme selected : "+ this.selectedOrganisme)
  }

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedOrganismeData = {
        lib_organisme : form.value.name ,
        tel : form.value.tel ,
        fax : form.value.fax ,
        adresse : form.value.adresse ,

      };

      this.organismeService
        .updateOrganisme(
          this.selectedOrganisme?.organisme_id,
          updatedOrganismeData
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

            console.error('Error updating organisme', error);
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
    this.selectedOrganisme = null;
  }

  AddDepartment() {
    this.router.navigate(['/organisme-list/add']);
  }
}
