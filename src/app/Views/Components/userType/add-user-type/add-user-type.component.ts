import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CollegeYearService } from '../../../../Services/college-year.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { UserTypeService } from '../../../../Services/user-type.service';

@Component({
  selector: 'app-add-user-type',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent],
  templateUrl: './add-user-type.component.html',
  styleUrl: './add-user-type.component.css'
})
export class AddUserTypeComponent {
  router: Router = new Router();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private userTypeServie: UserTypeService ,private popupMessageService : PopupMessageService ,  router : Router) {}

  

  onSubmit(form: NgForm) {
    if (form.valid) {
      const userTypeData = {
        lib_user_type: form.value.name,

      };

      this.userTypeServie.addUserType(userTypeData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage(" Type utilisateur ajouté avec succées !", 'success');
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/user-type-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage("Impossible d'ajouter le Type d'utilisateur !", 'error');
          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Libellé Type Utilisateur est réquis!';
      }
    }
  }
}
