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
import { Parcour } from '../../../../Models/parcour';
import { ParcourService } from '../../../../Services/parcour.service';

@Component({
  selector: 'app-parcour-list',
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
  templateUrl: './parcour-list.component.html',
  styleUrl: './parcour-list.component.css'
})
export class ParcourListComponent {
  dtOptions: Config = {};

  parcours: Parcour[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateParcourForm') updateParcourForm!: NgForm;

  selectedParcour: Parcour | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private parcourService: ParcourService,
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
        this.parcourService.getParcours().subscribe(
          (data: Parcour[]) => {

            callback({
              data: data.map((parcour) => ({
                code_parcours: parcour.code_parcours,
                lib_parcours_fr: parcour.lib_parcours_fr,

                actions: this.renderActions(parcour),
              })),
            });
          },
          (error) => {
            console.error('Error fetching Parcours', error);
          }
        );
      },
      columns: [
        {
          title: 'Code',
          data: 'code_parcours',
        },
        {
          title: 'Libellé Parcour',
          data: 'lib_parcours_fr',
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
      const parcour_data = $(event.target).data('parcour');
      this.updateParcourBtnClick(parcour_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const parcour_data = $(event.target).data('parcour');
      this.handleDelete(parcour_data);
    });
  }

  private renderActions(parcour: Parcour): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-parcour='${JSON.stringify(
      parcour
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-parcour='${JSON.stringify(
      parcour
    )}'>
       Delete
     </button>
     `;
  }

  getParcours() {
    this.parcourService.getParcours().subscribe(
      (data: Parcour[]) => {
        this.parcours = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching Parcours', error);
      }
    );
  }

  handleDelete(parcour: Parcour): void {
    this.dialogService
      .showConfirmDialog(parcour.lib_parcours_fr)
      .then((confirmed) => {
        if (confirmed) {
          this.parcourService.deleteParcour(parcour.parcours_id).subscribe(
            () => {
              window.location.reload();

              // Refresh the page after deletion
              this.parcours = this.parcours.filter(
                (p) => p.parcours_id !== parcour.parcours_id
              );
              this.popupMessageService.showPopupMessage("Parcour supprimé avec succées !", 'success');
            },
            (error) => {
              this.popupMessageService.showPopupMessage("Erreur lors de la suppression de Département", 'error');

              console.error('Error deleting departement', error);
            }
          );
        }
      });
  }

  populateForm(): void {
    if (this.selectedParcour) {
      const parcour = this.selectedParcour;

      this.updateParcourForm.form.patchValue({
        code: parcour.code_parcours,
        name: parcour.lib_parcours_fr,
      });
    }
  }

  updateParcourBtnClick(parcour: Parcour): void {
    this.selectedParcour = parcour;
    console.log('college year ' + parcour)
    this.populateForm();
    this.showUpdateForm = true;
    console.log("parcour selected : " + this.selectedParcour)
  }
  

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedParcourData = {
        code_parcours: form.value.code,
        lib_parcours_fr: form.value.name,
      };

      this.parcourService
        .updateParcour(
          this.selectedParcour?.parcours_id,
          updatedParcourData
        )
        .subscribe(
          () => {
            this.successMessage = 'Le parcour est modifiée avec succées!';
            this.errorMessage = null;
            this.showUpdateForm = false;
            window.location.reload();

            this.popupMessageService.showPopupMessage("Parcour Modifié avec succées !", 'success');

          },
          (error) => {
            this.popupMessageService.showPopupMessage("Erreur de modification de Parcour !", 'error');

            console.error('Error updating parcour', error);
            this.errorMessage = 'Erreur de modification de Parcour !';
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
    this.selectedParcour = null;
  }

  AddCollegeYear() {
    this.router.navigate(['/parcour-list/add']);
  }
}
