import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingType } from '../../../../Models/training-type';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { TrainingTypeService } from '../../../../Services/training-type.service';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { UserService } from '../../../../Services/user.service';
import { UserType } from '../../../../Models/user-type';
import { UserTypeService } from '../../../../Services/user-type.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  router: Router = new Router();

  laodedUserTypes: UserType[] = []; 


  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private userTypeService: UserTypeService ,  private userService : UserService, private popupMessageService : PopupMessageService, router : Router) {}

  ngOnInit(): void {
    this.loadUserTypes();

  }

  private loadUserTypes(): void {
    this.userTypeService.getUserTypes().subscribe(
      (userTypes: UserType[]) => {
        this.laodedUserTypes = userTypes; 
      },
      (error) => {
        console.error('Error fetching user Types', error);
        this.errorMessage = 'Error loading User Types!';
      }
    );
  }  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const userData = {
        username: form.value.username,
        password: form.value.password,
        firstname : form.value.firstname,
        lastname : form.value.lastname,
        email    : form.value.email,
        user_type: form.value.user_type,
      };

      this.userService.addUser(userData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage('Utilisateur ajouté avec succès!', 'success');

          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/user-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter l'utilisateur !", 'error');

          this.successMessage = null;
        }
      );
    } else {

      if (!form.value.name) {
        this.errorMessage = 'Le nom d utilisateur est réquis!';
      }
    }
  }

}
