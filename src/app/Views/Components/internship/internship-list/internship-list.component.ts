import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { ClassRoom } from '../../../../Models/classRoom';
import { Student } from '../../../../Models/student';
import { ClassService } from '../../../../Services/class.service';
import { DialogService } from '../../../../Services/dialog.service';
import { StudentService } from '../../../../Services/student.service';
import { AddButtonComponent } from '../../../Shared/add-button/add-button.component';
import { ConfirmButtonComponent } from '../../../Shared/confirm-button/confirm-button.component';
import { InternshipDetailsButtonComponent } from '../../../Shared/internship-details-button/internship-details-button.component';
import { UiMessageComponent } from '../../../Shared/ui-message/ui-message.component';
import { Internship } from '../../../../Models/internship';
import { InternshipService } from '../../../../Services/internship.service';
import { TrainingType } from '../../../../Models/training-type';
import { TrainingTypeService } from '../../../../Services/training-type.service';
import { DatePipe } from '@angular/common';
import { PopupMessageService } from '../../../../Services/popup-message.service';




@Component({
  selector: 'app-internship-list',
  standalone: true,
  imports: [
    DataTablesModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    InternshipDetailsButtonComponent,
    UiMessageComponent,
    ConfirmButtonComponent,
    AddButtonComponent,
  ],  templateUrl: './internship-list.component.html',
  styleUrl: './internship-list.component.css'
})
export class InternshipListComponent {
  dtOptions: Config = {};
  internships: Internship[] = [];
  fileName: string | null = null;
  fileError: string | null = null;

  selectedInternshipId: number |null = null;


  loadedClassRooms : ClassRoom[] = [];
  loadedStudents : Student[] = [];
  loadedTrainingTypes: TrainingType[] = [];

  @Input() inspectButtonLabel: string = 'Inspecter';
  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';



  @ViewChild('updateInternshipForm') updateInternshipForm!: NgForm;

  selectedInternship: Internship | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isAdmin : boolean = true;

  

  constructor(
    private internshipService: InternshipService,
    private router: Router,
    private dialogService: DialogService,
    private classRoomService : ClassService,
    private studentService : StudentService,
    private trainingTypeService : TrainingTypeService,
    private datePipe : DatePipe,
    private popupMessageService : PopupMessageService,

  ) {}

  ngOnInit(): void {
    this.loadClassRooms();
    this.loadStudents();
    this.loadTrainingTypes();
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.internshipService.getInternships().subscribe(
          
          (data: Internship[]) => {
            callback({
              data: data.map((internship) => ({
                stage_id: internship.stage_id,
                start_date: internship.start_date.split('T')[0],
                end_date: internship.end_date.split('T')[0],
                status : internship.status,
                evaluation : internship.evaluation,
                student : internship.student.name,
                classRoom: internship.classRoom.code_classe,
                trainingType: internship.trainingType.lib_niveau_formation_fr,
                actions: this.renderActions(internship),
              })),
            });
          },
          (error) => {
            console.error('Error fetching internships', error);
          }
        );
      },
      columns: [
        {
          title: 'Stage ID',
          data: 'stage_id',
        },
        {
          title: 'Stagiaire',
          data: 'student',
        },
        {
          title: 'Classe',
          data: 'classRoom',
        },
        {
          title: 'Date Début',
          data: 'start_date',
        },
        {
          title: 'Date Fin',
          data: 'end_date',
        },
        {
          title: 'Status',
          data: 'status',
        },
        
        {
          title: 'Actions',
          data: 'actions', // Rendered actions will be placed here
          orderable: false,
          render: (data: any, type: any, row: any) => {
            return data; // Return the rendered actions
          },
        },
      ],
    };

    // Event handling for buttons (outside Angular context)
    $(document).on('click', '.inspect-btn', (event) => {
      const internshipId = $(event.target).data('internship-id');
      this.inspectInternship(internshipId);
    });

    $(document).on('click', '.update-btn', (event) => {
      const internshipData = $(event.target).data('internship');
      this.updateInternshipBtnClick(internshipData);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const internshipData = $(event.target).data('internship');
      this.handleDelete(internshipData);
    });
  }

  
  renderActions(internship : Internship): string {
    // Generate HTML string based on isAdmin flag
    let actionsHtml = '';

    if (this.isAdmin) {
      actionsHtml += `
        <button class="btn btn-sm btn-primary inspect-btn" data-internship-id="${internship.stage_id}">
          Inspect
        </button>
      `;
    }

    actionsHtml += `
      <button class="btn btn-sm btn-warning update-btn" data-internship='${JSON.stringify(internship)}'>
        Update
      </button>
      <button class="btn btn-sm btn-danger delete-btn" data-internship='${JSON.stringify(internship)}'>
        Delete
      </button>
    `;

    return actionsHtml;
  }




  getinternships() {
    this.internshipService.getInternships().subscribe(
      (data: Internship[]) => {
        this.internships = data;
      },
      (error) => {
        console.error('Error fetching internships', error);
      }
    );
  }



  private loadClassRooms(): void {
    this.classRoomService.getClassRooms().subscribe(
      (classRooms: ClassRoom[]) => {
        this.loadedClassRooms = classRooms;
      },
      (error) => {
        console.error('Error fetching classRooms', error);
        this.errorMessage = 'Error loading classRooms!';
      }
    );
  }

  private loadStudents(): void {
    this.studentService.getStudents().subscribe(
      (students: Student[]) => {
        this.loadedStudents = students;
      },
      (error) => {
        console.error('Error fetching students', error);
        this.errorMessage = 'Error loading students!';
      }
    );
  }

  private loadTrainingTypes(): void {
    this.trainingTypeService.getTrainingTypes().subscribe(
      (trainingTypes: TrainingType[]) => {
        this.loadedTrainingTypes= trainingTypes;
      },
      (error) => {
        console.error('Error fetching trainingTypes', error);
        this.errorMessage = 'Error loading trainingTypes!';
      }
    );
  }


  handleDelete(internship: Internship | undefined): void {
    if (!internship) {
      return; 
    }

    this.dialogService
      .showConfirmDialog("le Stage de "+ internship.student.name)
      .then((confirmed) => {
        if (confirmed) {
          this.internshipService.deleteInternship(internship.stage_id).subscribe(
            () => {
              window.location.reload(); // Refresh the page after deletion
              this.popupMessageService.showPopupMessage("Stage supprimé avec succées" , 'success');

            },
            (error) => {
              this.popupMessageService.showPopupMessage("Erreur lors de la suppression de Stage" , 'error');

              console.error('Error deleting internship', error);
            }
          );
        }
      });
  }

  updateInternshipBtnClick(internship: Internship | undefined): void {
    if (!internship) {
      return; 
    }

    this.selectedInternship = internship;
    this.populateForm();
    this.showUpdateForm = true;
  }

  inspectInternship(internshipId: number | undefined): void {
    this.router.navigate(['/internship-list/details', internshipId]);
  }

  AddInternship() {
    this.router.navigate(['/internship-list/add']);
  }


  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedInternshipData: Partial<Internship> = {
        start_date: form.value.start_date,
        end_date: form.value.end_date,
        status: form.value.status,
        evaluation: form.value.evaluation,
        etudiant_cin: form.value.etudiant_cin,
        classe_id: form.value.classe_id,
        niveau_formation_id: form.value.niveau_formation_id,
      };

      // Combine day, month, and year into a valid date format

        if (this.selectedInternship) {
          this.internshipService.updateInternship(this.selectedInternship.stage_id, updatedInternshipData).subscribe(
            () => {
              this.successMessage = 'Stage modifié avec succès!';
              this.errorMessage = null;
              this.showUpdateForm = false;
              window.location.reload(); 
           
              this.popupMessageService.showPopupMessage("Stage modifié avec succès!" , 'success');

            },
            (error) => {
              this.popupMessageService.showPopupMessage("Erreur lors de la modification de Stage" , 'error');

              console.error('Erreur lors de la modification du Stage', error);
              this.errorMessage = 'Erreur lors de la modification du Stage!';
              this.successMessage = null;
            }
          );
        }
      
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis!';
      this.successMessage = null;
    }
  }


  

  onCancel(): void {
    this.showUpdateForm = false;
    this.selectedInternship = null;
  }

  populateForm(): void {
    if (this.selectedInternship) {
      const internship = this.selectedInternship;

      this.updateInternshipForm.form.patchValue({
        start_date: internship.start_date.split('T')[0],
        end_date: internship.end_date.split('T')[0],
        status: internship.status,
        evaluation: internship.evaluation,
        etudiant_cin: internship.etudiant_cin,
        classe_id: internship.classe_id,
        niveau_formation_id: internship.niveau_formation_id
      });
    }
  }

  
}
