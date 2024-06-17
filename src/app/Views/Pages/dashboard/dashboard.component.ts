import { Component } from '@angular/core';
import { StudentService } from '../../../Services/student.service';
import { InternshipService } from '../../../Services/internship.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  studentCount: number = 0;
  internshipCount : number = 0;
  nonConfirmedInternshipCount : number = 0;
  confirmedInternshipCount : number = 0;

  constructor(private studentService: StudentService , private internshipService : InternshipService) { }

  ngOnInit(): void {
    this.getStudentCount();
    this.getInternshipCount();
    this.getNonConfirmedInternshipCount();
    this.getConfirmedInternshipCount();
  }

  getStudentCount(): void {
    this.studentService.getStudents().subscribe(
      students => {
        this.studentCount = students.length;
      },
      error => {
        console.error('Error fetching students', error);
      }
    );
  }
  getInternshipCount(): void {
    this.internshipService.getInternships().subscribe(
      internships => {
        this.internshipCount = internships.length;
      },
      error => {
        console.error('Error fetching internships', error);
      }
    );
  }
  getNonConfirmedInternshipCount(): void {
    this.internshipService.getInternships().subscribe(
      internships => {
        const nonConfirmedInternships = internships.filter(internship => internship.status === 'en attente');
        this.nonConfirmedInternshipCount = nonConfirmedInternships.length;
      },
      error => {
        console.error('Error fetching internships', error);
      }
    );
  }

  getConfirmedInternshipCount(): void {
    this.internshipService.getInternships().subscribe(
      internships => {
        const confirmedInternships = internships.filter(internship => internship.status === 'Confirmé');
        this.confirmedInternshipCount = confirmedInternships.length;
      },
      error => {
        console.error('Error fetching internships', error);
      }
    );
  }

}
