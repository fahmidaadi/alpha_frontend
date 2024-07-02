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
import { Project } from '../../../../Models/project';
import { ProjectService } from '../../../../Services/project.service';
import { OrganismeService } from '../../../../Services/organisme.service';
import { Organisme } from '../../../../Models/organisme';

@Component({
  selector: 'app-projects-list',
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
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent {
  dtOptions: Config = {};

  projects: Project[] = [];
  loadedOrganismes : Organisme[] = [];

  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  router: Router = new Router();

  @ViewChild('updateProjectForm') updateProjectForm!: NgForm;

  selectedProject: Project | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private projectService: ProjectService,
    private organismeService : OrganismeService,
    router: Router,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadOrganismes();
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
        this.projectService.getProjects().subscribe(
          (data: Project[]) => {
            const formattedData = data.map((project) => {
              return {
                project_id : project.project_id,
                title: project.title,
                description: project.description,
                status: project.status,
                organisme: project.organisme?.lib_organisme,

                actions: this.renderActions(project),
              };
            });

            callback({ data: formattedData });
          },
          (error) => {
            console.error('Error fetching projects', error);
          }
        );
      },
      columns: [
        {
          title: 'Code Projet ',
          data: 'project_id',
        },
        {
          title: 'Tire du projet',
          data: 'title',
        },
        {
          title: 'Déscription du projet',
          data: 'description',
        },
        {
          title: 'Status du projet',
          data: 'status',
        },
        {
          title: 'Organisme',
          data: 'organisme',
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
      const project_data = $(event.target).data('project');
      this.updateProjectBtnClick(project_data);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const project_data = $(event.target).data('project');
      this.handleDelete(project_data);
    });
  }

  private renderActions(project: Project): string {
    return `
   
     <button class="btn btn-sm btn-warning update-btn" data-project='${JSON.stringify(
      project
    )}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-project='${JSON.stringify(
      project
    )}'>
       Delete
     </button>
     `;
  }

  getProjects() {
    this.projectService.getProjects().subscribe(
      (data: Project[]) => {
        this.projects = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching Projects', error);
      }
    );
  }

  private loadOrganismes(): void {
    this.organismeService.getOrganismes().subscribe(
      (organismes: Organisme[]) => {
        this.loadedOrganismes = organismes; 
      },
      (error) => {
        console.error('Error fetching organismes', error);
        this.errorMessage = 'Error loading Organismes!';
      }
    );
  }  

  handleDelete(project: Project): void {
    this.dialogService
      .showConfirmDialog(project.title)
      .then((confirmed) => {
        if (confirmed) {
          this.projectService.deleteProject(project.project_id).subscribe(
            () => {
              window.location.reload(); // Refresh the page after deletion
              this.projects = this.projects.filter(
                (p) => p.project_id !== project.project_id
              );
            },
            (error) => {
              console.error('Error deleting project', error);
            }
          );
        }
      });
  }

  populateForm(): void {
    if (this.selectedProject) {
      const project = this.selectedProject;

      this.updateProjectForm.form.patchValue({
        title: project.title,
        description: project.description,
        status: project.status,
        organisme_id : project.organisme_id

      });
    }
  }

  updateProjectBtnClick(project: Project): void {
    this.selectedProject = project;
    this.populateForm();
    this.showUpdateForm = true;
  }

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedProjectData = {
        title: form.value.title,
        description: form.value.description,
        status: form.value.status,
        organisme_id: form.value.organisme_id,


      };

      this.projectService
        .updateProject(
          this.selectedProject?.project_id,
          updatedProjectData
        )
        .subscribe(
          () => {
            this.successMessage = 'Le Projet est modifiée avec succées!';
            this.errorMessage = null;
            this.showUpdateForm = false;
            window.location.reload();
          },
          (error) => {
            console.error('Error updating project', error);
            this.errorMessage = 'Erreur de modification de projet !';
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
    this.selectedProject = null;
  }

  AddProject() {
    this.router.navigate(['/projects-list/add']);
  }
}
