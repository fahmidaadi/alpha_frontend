import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Internship } from '../../../../Models/internship';
import { InternshipService } from '../../../../Services/internship.service';
import { Student } from '../../../../Models/student';
import { StudentService } from '../../../../Services/student.service';

@Component({
  selector: 'app-lettre-affectation',
  standalone: true,
  imports: [],
  providers: [DatePipe], 
  templateUrl: './lettre-affectation.component.html',
  styleUrl: './lettre-affectation.component.css'
})
export class LettreAffectationComponent {

  internship: Internship | undefined;
  student : Student | undefined;
  formattedDate: string | null;
  errorMessage: string | null = null;
   currentYear = new Date().getFullYear();


  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private internshipService: InternshipService,
    private studentService  : StudentService
  ) {
    const now = new Date();
    this.formattedDate = this.datePipe.transform(now, 'dd/MM/yyyy');

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const internshipId = +params['internshipId'];
      const etudiantCin = params['etudiantCin']; 
    
      console.log(internshipId + " + " + etudiantCin);
    
      if (internshipId && etudiantCin) {
        this.fetchInternshipDataById(internshipId);
        this.fetchStudentDataById(etudiantCin);
      } else {
        console.error('No internshipId or etudiantCin found in route parameters');
      }
    });
  }

  fetchStudentDataById(etudiantCin: number): void {
    this.studentService.getStudentById(etudiantCin.toString()).subscribe(
      student => {
        if (student) {
          this.student = student;
          // Here you can also fetch additional data using etudiant1Cin if needed
          // Example: this.fetchStudentByCin(etudiant1Cin);
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

  fetchInternshipDataById(internshipId: number): void {
    this.internshipService.getInternshipById(internshipId.toString()).subscribe(
      internship => {
        if (internship) {
          this.internship = internship; // Directly assigning the fetched student
        } else {
          this.errorMessage = 'Error fetching student data';
        }
      },
      error => {
        console.error('Error fetching internship', error);
        this.errorMessage = 'Error fetching internship';
      }
    );}








    exportToPDF(): void {
      const element = document.getElementById('pdf-content');
    
      if (element && this.student?.name) { // Ensure student name is available
        html2canvas(element).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
          });
    
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 295; // A4 height in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
    
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
    
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
    
          // Save PDF with student's name
          const fileName = `demande-stage-${this.student?.name}.pdf`;
          pdf.save(fileName);
        });
      }
    }
    

  printContent() {
    const element = document.getElementById('pdf-content');

    if (element) {
      html2canvas(element).then((canvas) => {
        const imageData = canvas.toDataURL('image/png');
        const doc = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        doc.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        window.open(doc.output('bloburl'), '_blank');
      });
    }
  }
}
