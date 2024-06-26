import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Student } from '../../../../Models/student';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../../Services/student.service';
import * as CryptoJS from 'crypto-js';
import { FormsModule } from '@angular/forms';
import { InternshipService } from '../../../../Services/internship.service';
import { Internship } from '../../../../Models/internship';

@Component({
  selector: 'app-fiche-reponse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './fiche-reponse.component.html',
  styleUrl: './fiche-reponse.component.css',
})
export class FicheReponseComponent implements OnInit {
  
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
  

  exportToPDF() {
    // Sélectionner l'élément à capturer
    const element = document.getElementById('pdf-content');

    if (element) {
      // Utiliser html2canvas pour capturer l'élément en image
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = 210; // Largeur A4 en mm
        const pageHeight = 295; // Hauteur A4 en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Ajouter l'image au PDF
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Sauvegarder le PDF
        pdf.save('fiche-réponse.pdf');
      });
    }
  }
}
