import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Internship } from '../../../../Models/internship';
import { InternshipService } from '../../../../Services/internship.service';

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
  formattedDate: string | null;
  errorMessage: string | null = null;
   currentYear = new Date().getFullYear();


  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private internshipService: InternshipService
  ) {
    const now = new Date();
    this.formattedDate = this.datePipe.transform(now, 'dd/MM/yyyy');

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const internshipId = +params['internshipId'];
      if (internshipId) {
        this.fetchInternshipDataById(internshipId);
      } else {
        console.error('No internshipId found in route parameters');
      }
    });
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
          format: 'a4'
        });
        
        const imgWidth = 210; // Largeur A4 en mm
        const pageHeight = 295; // Hauteur A4 en mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
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
        pdf.save('lettre-affectation.pdf');
      });
    }
  }
}
