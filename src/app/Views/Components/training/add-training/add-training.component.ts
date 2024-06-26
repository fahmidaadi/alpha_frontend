import { Component, OnInit } from '@angular/core';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NgForm  } from '@angular/forms';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { Router } from '@angular/router';
import { TrainingService } from '../../../../Services/training.service';
import { PopupMessageService } from '../../../../Services/popup-message.service';
import { DepartmentService } from '../../../../Services/department.service';
import { Department } from '../../../../Models/department';
import { Observable, map, startWith } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { CollegeYear } from '../../../../Models/college-year';
import { CollegeYearService } from '../../../../Services/college-year.service';

@Component({
  selector: 'app-add-training',
  standalone: true,
  imports: [ConfirmButtonComponent , CommonModule , FormsModule , UiMessageComponent ,ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule ],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.css'
})
export class AddTrainingComponent implements OnInit {

  departmentControl = new FormControl('');
  loadedDepartments: Department[] = [];
  loadedCollegeYears : CollegeYear[] = [] ;



  router: Router = new Router();

  
  
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private trainingService: TrainingService ,private departmentService : DepartmentService , private collegeYearService : CollegeYearService ,   private popupMessageService : PopupMessageService,  router : Router) {}

   ngOnInit(): void {
    this.loadDepartments();
    this.loadCollegeYears();
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (departments: Department[]) => {
        this.loadedDepartments = departments;
      },
      (error) => {
        console.error('Error fetching departments', error);
        this.errorMessage = 'Error loading departments!';
      }
    );
  }

  private loadCollegeYears(): void {
    this.collegeYearService.getCollegeYears().subscribe(
      (collegeYears: CollegeYear[]) => {
        this.loadedCollegeYears = collegeYears;
      },
      (error) => {
        console.error('Error fetching collegeYears', error);
        this.errorMessage = 'Error loading collegeYears!';
      }
    );
  }
 

  onSubmit(form: NgForm) {
    if (form.valid) {
      const trainingData = {
        code_formation: form.value.code,
        lib_formation_fr: form.value.name,
        departement_id: form.value.departement,
        annee_universitaire_id : form.value.collegeYear,
        department: form.value.departement,
        collegeYear: form.value.collegeYear

      };

      

      this.trainingService.addTraining(trainingData).subscribe(
        (response) => {
          this.popupMessageService.showPopupMessage(" Formation ajouté avec succées !", 'success');
          console.log(JSON.stringify(trainingData))

          this.successMessage = 'Formation ajouté avec succées !';
          this.errorMessage = null;
          form.resetForm();
          this.router.navigate(['/training-list']);

        },
        (error) => {
          this.popupMessageService.showPopupMessage(" Impossible d'ajouter la Formation !", 'error');

          this.errorMessage = "Impossible d'ajouter la Formation !";
          this.successMessage = null;
        }
      );
    } else {
      // Check which fields are empty and set corresponding error messages
      if (!form.value.name) {
        this.errorMessage = 'Le nom de formation est réquis!';
      }
    }
  }


}
