import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { InternshipType } from '../../../../Models/internship-type';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { DialogService } from '../../../../Services/dialog.service';
import { InternshipTypeService } from '../../../../Services/internship-type.service';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-internship-type-list',
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
  templateUrl: './internship-type-list.component.html',
  styleUrl: './internship-type-list.component.css'
})
export class InternshipTypeListComponent implements OnInit {

  dtOptions: Config = {};

  internshipTypes: InternshipType[] = [];
  
  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';


  router: Router = new Router();


  @ViewChild('updateInternshipTypeForm') updateInternshipTypeForm!: NgForm;

  selectedInternshipType: InternshipType | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private internshipTypeService: InternshipTypeService, router: Router , private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
       ajax: (dataTablesParameters: any, callback) => {
         this.internshipTypeService.getInternshipTypes().subscribe(
           (data: InternshipType[]) => {
             callback({
               data: data.map(internshipType => ({
                type_stage_id: internshipType.type_stage_id,
                lib_Type_Stage_fr: internshipType.lib_Type_Stage_fr,
                code_type_stage: internshipType.code_type_stage,
                 actions: this.renderActions(internshipType), // Include the actions here
               }))
             });
           },
           (error) => {
             console.error('Error fetching trainings', error);
           }
         );
       },
       columns: [{
         title: 'Code de Type de Stage',
        data: 'code_type_stage'
       }, {
         title: 'Type de Stage',
         data: 'lib_Type_Stage_fr'
       },
      
       {
         title: 'Actions',
         data: 'actions', // Rendered actions will be placed here
         orderable: false,
         render: (data: any, type: any, row: any) => {
           return data; // Return the rendered actions
         }
       }],
     };
 
    
 
     $(document).on('click', '.update-btn', (event) => {
       const internship_type_data = $(event.target).data('internship_type');
       this.updateInternshipTypeBtnClick(internship_type_data);
     });
 
     $(document).on('click', '.delete-btn', (event) => {
       const internship_type_data = $(event.target).data('internship_type');
       this.handleDelete(internship_type_data);
     });
   }
 
 
   private renderActions(internship_type: InternshipType): string {
     return `
   
     <button class="btn btn-sm btn-warning update-btn" data-internship_type='${JSON.stringify(internship_type)}'>
       Update
     </button>
     <button class="btn btn-sm btn-danger delete-btn" data-internship_type='${JSON.stringify(internship_type)}'>
       Delete
     </button>
     `;
   }

 

 




  
  getInternshipTypes() {
    this.internshipTypeService.getInternshipTypes().subscribe(
      (data: InternshipType[]) => {
        this.internshipTypes = data;
        console.log("internship_data " ,data);
      },
      (error) => {
        console.error('Error fetching Internship Types', error);
      }
    );
  }
  
  handleDelete(internshipType: InternshipType): void {
    this.dialogService.showConfirmDialog(internshipType.lib_Type_Stage_fr).then((confirmed) => {
      if (confirmed) {
        this.internshipTypeService.deleteInternshipType(internshipType.type_stage_id).subscribe(
          () => {
            console.log("result: "+ internshipType.type_stage_id  );
            this.internshipTypes = this.internshipTypes.filter(
              (i) => i.type_stage_id !== internshipType.type_stage_id
              
              
              );
              },
              (error) => {
                console.error('Error deleting InternshipType', error);
                }
                );
                   window.location.reload(); //refresh dataTable
                }
    });
  }

  populateForm(): void {
    if (this.selectedInternshipType) {
      const internshipType = this.selectedInternshipType;

      this.updateInternshipTypeForm.form.patchValue({
        name: internshipType.lib_Type_Stage_fr,
        code: internshipType.code_type_stage,
      });
    }
  }

  updateInternshipTypeBtnClick(internshipType: InternshipType): void {
    this.selectedInternshipType = internshipType;
    this.populateForm();
    this.showUpdateForm = true;
  }

  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedInternshipTypeData = {
        lib_Type_Stage_fr: form.value.name,
        code_type_stage: form.value.code,
      };
    

      this.internshipTypeService
        .updateInternshipType(this.selectedInternshipType?.type_stage_id, updatedInternshipTypeData)
        .subscribe(
          () => {
            console.log("data success: "+updatedInternshipTypeData.lib_Type_Stage_fr);
            this.successMessage = 'Type de stage est modifié avec succéés!';
            this.errorMessage = null;
            this.showUpdateForm = false;
            window.location.reload();
          },
          (error) => {
            console.log("data error: "+updatedInternshipTypeData.lib_Type_Stage_fr);

            console.error('Error updating Training', error);
            this.errorMessage = 'erreur de modification de type de stage!';
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
    this.selectedInternshipType = null;
  }

  AddInternshipType(){
    this.router.navigate(['/internship-types-list/add']);
  }
}
