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
import { CollegeYear } from '../../../../Models/college-year';
import { CollegeYearService } from '../../../../Services/college-year.service';

@Component({
  selector: 'app-college-year-list',
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
  templateUrl: './college-year-list.component.html',
  styleUrl: './college-year-list.component.css'
})
export class CollegeYearListComponent {
  dtOptions: Config = {};

  collegeYears: CollegeYear[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateCollegeYearForm') updateCollegeYearForm!: NgForm;

  selectedCollegeYear: CollegeYear | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private collegeYearService: CollegeYearService,
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
        this.collegeYearService.getCollegeYears().subscribe(
          (data: CollegeYear[]) => {

            callback({
              data: data.map((collegeYear) => ({
                annee_universitaire_id: collegeYear.annee_universitaire_id,
                annee_universitaire: collegeYear.annee_universitaire,
                actions: this.renderActions(collegeYear),
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
          data: 'annee_universitaire_id',
        },
        {
          title: 'Libellé Année Universitaire',
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
      const collegeYear_data = $(event.target).data('collegeYear');
      this.updateCollegeYearBtnClick(collegeYear_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const collegeYear_data = $(event.target).data('collegeYear');
      this.handleDelete(collegeYear_data);
    });
  }

  private renderActions(collegeYear: CollegeYear): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-college-Year='${JSON.stringify(
      collegeYear
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-college-Year='${JSON.stringify(
      collegeYear
    )}'>
       Delete
     </button>
     `;
  }

  getCollegeYears() {
    this.collegeYearService.getCollegeYears().subscribe(
      (data: CollegeYear[]) => {
        this.collegeYears = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching CollegeYears', error);
      }
    );
  }

  handleDelete(collegeYear: CollegeYear): void {
    this.dialogService
      .showConfirmDialog(collegeYear.annee_universitaire)
      .then((confirmed) => {
        if (confirmed) {
          this.collegeYearService.deleteCollegeYear(collegeYear.annee_universitaire_id).subscribe(
            () => {
              window.location.reload();

              // Refresh the page after deletion
              this.collegeYears = this.collegeYears.filter(
                (c) => c.annee_universitaire_id !== collegeYear.annee_universitaire_id
              );
              this.popupMessageService.showPopupMessage("Année Universitaire supprimé avec succées !", 'success');
            },
            (error) => {
              this.popupMessageService.showPopupMessage("Erreur lors de la suppression de l'année universitaire", 'error');

              console.error('Error deleting departement', error);
            }
          );
        }
      });
  }

  populateForm(): void {
    if (this.selectedCollegeYear) {
      const collegeYear = this.selectedCollegeYear;

      this.updateCollegeYearForm.form.patchValue({
        name: collegeYear.annee_universitaire,
      });
    }
  }

  updateCollegeYearBtnClick(collegeYear: CollegeYear): void {
    this.selectedCollegeYear = collegeYear;
    console.log('college year ' + collegeYear)
    this.populateForm();
    this.showUpdateForm = true;
    console.log("collegeYear selected : " + this.selectedCollegeYear)
  }
  

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedCollegeYearData = {
        annee_universitaire: form.value.name,
      };

      this.collegeYearService
        .updateCollegeYear(
          this.selectedCollegeYear?.annee_universitaire_id,
          updatedCollegeYearData
        )
        .subscribe(
          () => {
            this.errorMessage = null;
            this.showUpdateForm = false;
            window.location.reload();

            this.popupMessageService.showPopupMessage("Année Universitaire Modifié avec succées !", 'success');

          },
          (error) => {
            this.popupMessageService.showPopupMessage("Erreur de modification de l'année Universitaire !", 'error');

            console.error('Error updating collegeYear', error);
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
    this.selectedCollegeYear = null;
  }

  AddCollegeYear() {
    this.router.navigate(['/college-year-list/add']);
  }
}
