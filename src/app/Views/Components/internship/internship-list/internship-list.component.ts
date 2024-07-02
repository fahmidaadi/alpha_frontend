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
import { ProjectService } from '../../../../Services/project.service';
import { Project } from '../../../../Models/project';
import { SupervisorService } from '../../../../Services/supervisor.service';
import { Supervisor } from '../../../../Models/supervisor';

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
  ],
  templateUrl: './internship-list.component.html',
  styleUrl: './internship-list.component.css',
})
export class InternshipListComponent {
  dtOptions: Config = {};
  internships: Internship[] = [];
  fileName: string | null = null;
  fileError: string | null = null;

  selectedInternshipId: number | null = null;

  loadedClassRooms: ClassRoom[] = [];
  loadedStudents: Student[] = [];
  loadedTrainingTypes: TrainingType[] = [];
  loadedProjects: Project[] = [];
  loadedSupervisors: Supervisor[] = [];

  selectedClassroomId: number | null = null;
  filteredStudents: Student[] = [];

  students: {
    selectedStudentCin: string;
    selectedStudentClassroomId: number;
    selectedStudentTrainingTypeId: number;
  }[] = [
    {
      selectedStudentCin: '',
      selectedStudentClassroomId: 0,
      selectedStudentTrainingTypeId: 0,
    },
  ];

  @Input() inspectButtonLabel: string = 'Inspecter';
  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';

  @ViewChild('updateInternshipForm') updateInternshipForm!: NgForm;

  selectedInternship: Internship | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isAdmin: boolean = true;

  constructor(
    private internshipService: InternshipService,
    private router: Router,
    private dialogService: DialogService,
    private classRoomService: ClassService,
    private studentService: StudentService,
    private trainingTypeService: TrainingTypeService,
    private projectService: ProjectService,
    private supervisorService: SupervisorService,
    private datePipe: DatePipe,
    private popupMessageService: PopupMessageService
  ) {}

  ngOnInit(): void {
    this.loadClassRooms();
    this.loadStudents();
    this.loadTrainingTypes();
    this.loadProjects();
    this.loadSupervisors();

    this.dtOptions = {
      language: {
        emptyTable: 'Aucune donnée disponible dans le tableau',
        loadingRecords: 'Chargement...',
        processing: 'Traitement...',
        decimal: ',',
        info: 'Affichage de _START_ à _END_ sur _TOTAL_ entrées',
        infoEmpty: 'Affichage de 0 à 0 sur 0 entrées',
        infoFiltered: '(filtrées depuis un total de _MAX_ entrées)',
        lengthMenu: 'Afficher _MENU_ entrées',
        paginate: {
          first: 'Première',
          last: 'Dernière',
          next: 'Suivante',
          previous: 'Précédente',
        },
        zeroRecords: 'Aucune entrée correspondante trouvée',
        aria: {
          sortAscending: ' : activer pour trier la colonne par ordre croissant',
          sortDescending:
            ' : activer pour trier la colonne par ordre décroissant',
        },
        search: 'Rechercher :',
        thousands: ' ',
      },

      ajax: (dataTablesParameters: any, callback) => {
        this.internshipService.getInternships().subscribe(
          (data: Internship[]) => {
            callback({
              data: data.map((internship) => ({
                stage_id: internship.stage_id,
                start_date: internship.start_date.split('T')[0],
                end_date: internship.end_date.split('T')[0],
                date_soutenance: internship.date_soutenance.split('T')[0],
                status: internship.status,
                evaluation: internship.evaluation,
                Etudiants:
                  internship.Etudiants?.map((student) => student.name).join(
                    ', '
                  ) || 'loading ...',
                classRoom: internship.classRoom.code_classe,
                trainingType: internship.trainingType!.lib_niveau_formation_fr,
                project: internship.project?.title,
                encadrant: internship.supervisor?.name,
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
          title: 'Stagiaires',
          data: 'Etudiants',
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
          data: 'actions',
          orderable: false,
          render: (data: any, type: any, row: any) => {
            return data;
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

  renderActions(internship: Internship): string {
    let actionsHtml = '';

    if (this.isAdmin) {
      actionsHtml += `
        <button class="btn btn-sm btn-primary inspect-btn" data-internship-id="${internship.stage_id}">
          Inspect
        </button>
      `;
    }

    actionsHtml += `
      <button class="btn btn-sm btn-warning update-btn" data-internship='${JSON.stringify(
        internship
      )}'>
        Update
      </button>
      <button class="btn btn-sm btn-danger delete-btn" data-internship='${JSON.stringify(
        internship
      )}'>
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

  private loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects: Project[]) => {
        this.loadedProjects = projects;
      },
      (error) => {
        console.error('Error fetching students', error);
        this.errorMessage = 'Error loading students!';
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

  private loadSupervisors(): void {
    this.supervisorService.getSupervisors().subscribe(
      (supervisors: Supervisor[]) => {
        this.loadedSupervisors = supervisors;
      },
      (error) => {
        console.error('Error fetching supervisors', error);
        this.errorMessage = 'Error loading supervisors!';
      }
    );
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe(
      (students: Student[]) => {
        this.loadedStudents = students;
        this.filterStudentsByClassroom();
      },
      (error) => {
        console.error('Error fetching students', error);
        this.errorMessage = 'Error loading students!';
      }
    );
  }

  filterStudentsByClassroom(): void {
    if (this.selectedClassroomId) {
      this.filteredStudents = this.loadedStudents.filter(
        (student) => student.classe_id === Number(this.selectedClassroomId)
      );
    } else {
      this.filteredStudents = [];
    }
  }

  private loadTrainingTypes(): void {
    this.trainingTypeService.getTrainingTypes().subscribe(
      (trainingTypes: TrainingType[]) => {
        this.loadedTrainingTypes = trainingTypes;
      },
      (error) => {
        console.error('Error fetching trainingTypes', error);
        this.errorMessage = 'Error loading trainingTypes!';
      }
    );
  }

  onStudentChange(selectedStudentCin: string, index: number): void {
    const selectedStudent = this.loadedStudents.find(
      (student) => student.cin === Number(selectedStudentCin)
    );
    if (selectedStudent) {
      this.students[index].selectedStudentClassroomId =
        selectedStudent.classe_id;
      this.students[index].selectedStudentTrainingTypeId =
        selectedStudent.classRoom.niveau_formation_id;
    }
  }

  onClassroomChange(): void {
    this.filterStudentsByClassroom();
    if (this.students.length === 1) {
      this.addStudent();
    }
  }

  handleDelete(internship: Internship | undefined): void {
    if (!internship) {
      return;
    }

    this.dialogService
      .showConfirmDialog(
        'le Stage de ' +
          internship.etudiant1_cin?.name +
          ' et ' +
          internship.etudiant1_cin?.name
      )
      .then((confirmed) => {
        if (confirmed) {
          this.internshipService
            .deleteInternship(internship.stage_id)
            .subscribe(
              () => {
                window.location.reload(); // Refresh the page after deletion
                this.popupMessageService.showPopupMessage(
                  'Stage supprimé avec succées',
                  'success'
                );
              },
              (error) => {
                this.popupMessageService.showPopupMessage(
                  'Erreur lors de la suppression de Stage',
                  'error'
                );

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
    // Check if the form is valid and there are students selected
    if (form.valid && this.students.length > 0) {
        // Convert the start and end dates to the required format
      
        // Extract CINs from the students array
        const studentCins = this.students.map(student => student.selectedStudentCin);

        // Create an internship data object with the necessary fields
        const updatedInternshipData: Partial<Internship> = {
            start_date: form.value.start_date,
            end_date: form.value.end_date,
            date_soutenance: form.value.date_soutenance,
            status: form.value.status,
            evaluation: form.value.evaluation,
            classe_id: form.value.classe_id,
            niveau_formation_id: form.value.niveau_formation_id,
            project_id: form.value.project_id,
            encadrant_id: form.value.encadrant_id,
            etudiants: studentCins, 


            classRoom: form.value.classRoom,
            trainingType: form.value.trainingType,
            supervisor: form.value.supervisor,
        };

        // Update the internship
        if (this.selectedInternship) {
            this.internshipService.updateInternship(this.selectedInternship.stage_id, updatedInternshipData).subscribe(
              () => {
                  console.log(updatedInternshipData)
                    this.popupMessageService.showPopupMessage('Stage modifié avec succès!', 'success');
                    window.location.reload();
                  },
                (error) => {
                    // On error, log the error and show an error message
                    console.error('Erreur lors de la modification du Stage', error);
                    this.errorMessage = 'Erreur lors de la modification du Stage!';
                    this.successMessage = null;
                }
            );
        }
    } else {
        // If the form is invalid or no students are selected, show an error message
        this.errorMessage = 'Formulaire invalide ou aucun étudiant sélectionné!';
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
        date_soutenance: internship.date_soutenance.split('T')[0],
        status: internship.status,
        evaluation: internship.evaluation,
        classe_id: internship.classe_id,
        niveau_formation_id: internship.niveau_formation_id,
        project_id: internship.project_id,
        encadrant_id: internship.encadrant_id,
      });

      this.students = [
        {
          selectedStudentCin: internship.etudiant1_cin?.cin.toString() || '',
          selectedStudentClassroomId: internship.classe_id,
          selectedStudentTrainingTypeId: internship.niveau_formation_id,
        },
      ];

      if (internship.etudiant2_cin) {
        this.students.push({
          selectedStudentCin: internship.etudiant2_cin.cin.toString(),
          selectedStudentClassroomId: internship.classe_id,
          selectedStudentTrainingTypeId: internship.niveau_formation_id,
        });
      }
    }
  }

  addStudent(): void {
    if (this.students.length < 2) {
      this.students.push({
        selectedStudentCin: '',
        selectedStudentClassroomId: 0,
        selectedStudentTrainingTypeId: 0,
      });
    }
  }
  removeStudent(index: number): void {
    if (this.students.length > 1) {
      this.students.splice(index, 1);
    }
  }
}
