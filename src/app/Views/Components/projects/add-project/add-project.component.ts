import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { Organisme } from '../../../../Models/organisme';
import { OrganismeService } from '../../../../Services/organisme.service';
import { ProjectService } from '../../../../Services/project.service';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  router: Router = new Router();

  loadedOrganismes: Organisme[] = []; 


  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private organismeService: OrganismeService ,  private projectService : ProjectService, private popupMessageService : PopupMessageService, router : Router) {}

  ngOnInit(): void {
    this.loadOrganismes();

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

  onSubmit(form: NgForm) {
    if (form.valid) {
      const projectData = {
        title: form.value.title,
        description : form.value.description,
        status : form.value.status,
        organisme_id : form.value.organisme_id,
      };

      this.projectService.addProject(projectData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage('Projet ajouté avec succès!', 'success');

          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/projects-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter le Projet !", 'error');

          this.successMessage = null;
        }
      );
    } 
  
  }

}
