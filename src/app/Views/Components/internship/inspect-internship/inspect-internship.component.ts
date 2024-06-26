import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Internship } from '../../../../Models/internship';
import { InternshipService } from '../../../../Services/internship.service';
import { StudentService } from '../../../../Services/student.service';
import { Student } from '../../../../Models/student';

@Component({
  selector: 'app-inspect-internship',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inspect-internship.component.html',
  styleUrl: './inspect-internship.component.css'
})
export class InspectInternshipComponent {
  @Input() inspectedInternship: Internship | null = null; 
  selectedStudent : Student | undefined ;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private internshipService: InternshipService , private studentService : StudentService, private router : Router) { }
  
  

  ngOnInit(): void {
    if (!this.inspectedInternship) {
      const internshipId = this.route.snapshot.paramMap.get('id');
      if (internshipId) {
        this.getInternshipById(internshipId);
      }
    } else {
      this.loadStudentFromInternship();
    }
  }

  getInternshipById(internshipId: string): void {
    this.internshipService.getInternshipById(internshipId).subscribe(
      internship => {
        if (internship) {
          this.inspectedInternship = internship;
          this.loadStudentFromInternship();
          console.log("Inspected internship:", internship);
        } else {
          this.errorMessage = 'Error fetching internship data';
        }
      },
      error => {
        console.error('Error fetching internship:', error);
        this.errorMessage = 'Error fetching internship';
      }
    );
  }

  loadStudentFromInternship(): void {
    const studentCin = this.inspectedInternship?.etudiant1_cin?.cin;
    if (studentCin) {
      this.getStudentById(studentCin);
    } else {
      this.errorMessage = 'No student CIN available for this internship';
    }
  }

  getStudentById(studentCin: number): void {
    this.studentService.getStudentById(studentCin.toString()).subscribe(
      student => {
        if (student) {
          this.selectedStudent = student;
          console.log("Selected student data:", student);
        } else {
          this.errorMessage = 'Error fetching student data';
        }
      },
      error => {
        console.error('Error fetching student:', error);
        this.errorMessage = 'Error fetching student';
      }
    );
  }

  goToFicheReponseStudent1(internshipId: number, etudiantCin: number): void {
    console.log("etudiant cin " + etudiantCin + " stage id " + internshipId);
    this.router.navigate(['/fiche-reponse', internshipId, etudiantCin]);
  }

  goToFicheReponseStudent2(internshipId: number, etudiantCin: number): void {
    this.router.navigate(['/fiche-reponse', internshipId, etudiantCin]);
  }

  goToDemandeDeStageStudent1(internshipId: number, etudiantCin: number): void {
    this.router.navigate(['/demande-de-stage', internshipId, etudiantCin]);
  }

  goToDemandeDeStageStudent2(internshipId: number, etudiantCin: number): void {
    this.router.navigate(['/demande-de-stage', internshipId, etudiantCin]);
  }

  goToLettreDaffectationStudent1(internshipId: number, etudiantCin: number): void {
    this.router.navigate(['/lettre-affectation', internshipId, etudiantCin]);
  }

  goToLettreDaffectationStudent2(internshipId: number, etudiantCin: number): void {
    this.router.navigate(['/lettre-affectation', internshipId, etudiantCin]);
  }

  
}
