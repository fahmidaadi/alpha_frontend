import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { Student } from '../../../Models/student';
import { StudentService } from '../../../Services/student.service';
import { NavigationExtras, Router } from '@angular/router';
import { InternshipDetailsButtonComponent } from '../../Shared/internship-details-button/internship-details-button.component';
import { UiMessageComponent } from '../../Shared/ui-message/ui-message.component';
import { ConfirmButtonComponent } from '../../Shared/confirm-button/confirm-button.component';
import { AddButtonComponent } from '../../Shared/add-button/add-button.component';
import { DialogService } from '../../../Services/dialog.service';
import { Config } from 'datatables.net';
import { ClassService } from '../../../Services/class.service';
import { ClassRoom } from '../../../Models/classRoom';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS


@Component({
  selector: 'app-student-list-table',
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
  templateUrl: './student-list-table.component.html',
  styleUrl: './student-list-table.component.css',
})
export class StudentListTableComponent implements OnInit {
  dtOptions: Config = {};
  students: Student[] = [];
  fileName: string | null = null;
  fileError: string | null = null;

  selectedClassRoomId: number |null = null;


  loadedClassRooms : ClassRoom[] = [];

  @Input() inspectButtonLabel: string = 'Inspecter';
  @Input() deleteButtonLabel: string = 'Supprimer';
  @Input() updateButtonLabel: string = 'Modifier';
  @Input() ficheReponseButtonLabel: string = 'Fiche Reponse';




  @ViewChild('updateStudentForm') updateStudentForm!: NgForm;

  selectedStudent: Student | null = null;
  showUpdateForm: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  day: string | undefined;
  month: string | undefined;
  year: string | undefined;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private dialogService: DialogService,
    private classRoomService : ClassService
  ) {}

  ngOnInit(): void {
    this.loadClassRooms();
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
        this.studentService.getStudents().subscribe(
          
          (data: Student[]) => {
            callback({
              data: data.map((student) => ({
                cin: student.cin,
                name: student.name,
                email: student.email,
                dte_naiss : student.dte_naiss.split('T')[0],
                classRoom : student.classRoom.code_classe,
                actions: this.renderActions(student),
              })),
            });
          },
          (error) => {
            console.error('Error fetching students', error);
          }
        );
      },
      columns: [
        {
          title: 'N° CIN',
          data: 'cin',
        },
        {
          title: 'Nom et Prénom',
          data: 'name',
        },
        {
          title: 'E-mail',
          data: 'email',
        },
        {
          title: 'Date de Naissance',
          data: 'dte_naiss',
        },
        {
          title: 'Classe',
          data: 'classRoom',
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
      const studentId = $(event.target).data('student-id');
      this.inspectStudent(studentId);
    });

    $(document).on('click', '.update-btn', (event) => {
      const studentData = $(event.target).data('student');
      this.updateStudentBtnClick(studentData);
    });

    $(document).on('click', '.delete-btn', (event) => {
      const studentData = $(event.target).data('student');
      this.handleDelete(studentData);
    });
   
  
  }

  
  private renderActions(student: Student): string {
    return `
    <button class="btn btn-sm btn-primary inspect-btn" data-student-id="${
      student.cin
    }">
      Inspect
    </button>
    <button class="btn btn-sm btn-warning update-btn" data-student='${JSON.stringify(
      student
    )}'>
      Update
    </button>
    <button class="btn btn-sm btn-danger delete-btn" data-student='${JSON.stringify(
      student
    )}'>
      Delete
    </button>

    `;
  }




  getStudents() {
    this.studentService.getStudents().subscribe(
      (data: Student[]) => {
        this.students = data;
      },
      (error) => {
        console.error('Error fetching students', error);
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

  handleDelete(student: Student | undefined): void {
    if (!student) {
      return; // Do nothing if student is undefined
    }

    this.dialogService
      .showConfirmDialog(student.name)
      .then((confirmed) => {
        if (confirmed) {
          this.studentService.deleteStudent(student.cin).subscribe(
            () => {
              window.location.reload(); // Refresh the page after deletion
            },
            (error) => {
              console.error('Error deleting student', error);
            }
          );
        }
      });
  }

  updateStudentBtnClick(student: Student | undefined): void {
    if (!student) {
      return; // Do nothing if student is undefined
    }

    this.selectedStudent = student;
    this.populateForm();
    this.showUpdateForm = true;
  }

  inspectStudent(studentId: number | undefined): void {
    this.router.navigate(['/student/details', studentId]);
  }

  AddStudent() {
    this.router.navigate(['/student/add']);
  }

  
  onFileChange(event: any) {
    const file = event.target.files[0];
    const validExtensions = ['xls', 'xlsx'];

    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (validExtensions.includes(fileExtension)) {
        this.fileName = file.name;
        this.fileError = null;
        console.log('File selected:', this.fileName);
      } else {
        this.fileName = null;
        this.fileError = "Ce type de fichier n'est pas pris en charge. Veuillez télécharger un fichier Excel.";
        console.log('Invalid file type selected');
      }
    } else {
      this.fileName = null;
      this.fileError = null;
      console.log('No file selected');
    }
  }

  confirmUpload() {
    if (this.fileName && this.selectedClassRoomId) {
        const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('uploaded_excel', file);
            
            this.studentService.addStudentWithExcelFile(this.selectedClassRoomId, formData).subscribe(
                (response) => {
                    console.log('File uploaded successfully:', response);
                    this.successMessage = 'File uploaded successfully!';
                    this.errorMessage = null;
                },
                (error) => {
                    console.error('File upload failed:', error);
                    this.errorMessage = 'File upload failed!';
                    this.successMessage = null;
                }
            );

            this.resetFileInput();
        } else {
            this.fileError = 'Ajouter un fichier Excel.';
        }
    } else {
        this.fileError = 'Veuillez sélectionner une Classe.';
    }
}


  cancelUpload() {
    this.resetFileInput();
    console.log('File upload canceled');
  }

  resetFileInput() {
    this.fileName = null;
    this.fileError = null;
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


  onFormSubmit(form: NgForm): void {
    if (form.valid) {
      const updatedStudentData: Partial<Student> = {
        name: form.value.name,
        email: form.value.email,
        phone_nbr: form.value.phone_nbr,
        classe_id: form.value.classe,
      };

      // Combine day, month, and year into a valid date format
      const dateOfBirth = this.formatDateOfBirth(this.day, this.month, this.year);
      if (dateOfBirth) {
        updatedStudentData.dte_naiss = dateOfBirth;

        if (this.selectedStudent) {
          this.studentService.updateStudent(this.selectedStudent.cin, updatedStudentData).subscribe(
            () => {
              this.successMessage = 'Stagaire modifié avec succès!';
              this.errorMessage = null;
              this.showUpdateForm = false;
              this.getStudents();
              window.location.reload(); 
            },
            (error) => {
              console.error('Erreur lors de la modification du stagaire', error);
              this.errorMessage = 'Erreur lors de la modification du stagaire!';
              this.successMessage = null;
            }
          );
        }
      } else {
        this.errorMessage = 'Date de naissance invalide!';
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis!';
      this.successMessage = null;
    }
  }


  formatDateOfBirth(day: string | undefined, month: string | undefined, year: string | undefined): string | null {
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
  }

  onCancel(): void {
    this.showUpdateForm = false;
    this.selectedStudent = null;
  }

  populateForm(): void {
    if (this.selectedStudent) {
      const student = this.selectedStudent;

      // Split date of birth into day, month, and year
      const dateParts = student.dte_naiss.split('-');
      this.year = dateParts[0];
      this.month = dateParts[1];
      this.day = dateParts[2];

      this.updateStudentForm.form.patchValue({
        cin: student.cin,
        name: student.name,
        email: student.email,
        day: this.day.split('T')[0],
        month: this.month,
        year: this.year,
        phone_nbr: student.phone_nbr,
        classe: student.classe_id
      });
    }
  }

  


}
