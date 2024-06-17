import { Component, Input, OnInit, input } from '@angular/core';
import { Student } from '../../../../Models/student';
import { StudentService } from '../../../../Services/student.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { data } from 'jquery';


@Component({
  selector: 'app-inspect-student',
  standalone: true,
  imports: [CommonModule ,  ],
  templateUrl: './inspect-student.component.html',
  styleUrl: './inspect-student.component.css'
})
export class InspectStudentComponent implements OnInit {

  @Input() inspectedStudent: Student | null = null; 
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private studentService: StudentService) { }
  
  

  ngOnInit(): void {
    if (!this.inspectedStudent) { 
      const studentId = this.route.snapshot.paramMap.get('id'); 
      if (studentId) {
        this.getStudentById(studentId);
      }
    }
  }

  getStudentById(studentId: string): void {
    this.studentService.getStudentById(studentId).subscribe(
      student => {
        if (student) {
          this.inspectedStudent = student; // Directly assigning the fetched student
        } else {
          this.errorMessage = 'Error fetching student data';
        }
      },
      error => {
        console.error('Error fetching student', error);
        this.errorMessage = 'Error fetching student';
      }
    );
  }
  

  sendEmail(email: string | undefined): void {
    if (email) {
      const mailtoUrl = `mailto:${email}`;
      window.location.href = mailtoUrl;
    }
  }
}
