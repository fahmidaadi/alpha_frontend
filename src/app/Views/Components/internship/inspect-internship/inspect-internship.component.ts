import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Internship } from '../../../../Models/internship';
import { InternshipService } from '../../../../Services/internship.service';

@Component({
  selector: 'app-inspect-internship',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inspect-internship.component.html',
  styleUrl: './inspect-internship.component.css'
})
export class InspectInternshipComponent {
  @Input() inspectedInternship: Internship | null = null; 
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private internshipService: InternshipService , private router : Router) { }
  
  

  ngOnInit(): void {
    if (!this.inspectedInternship) { 
      const internshipId = this.route.snapshot.paramMap.get('id'); 
      if (internshipId) {
        this.getInternshipById(internshipId);
      }
    }
  }

  getInternshipById(internshipId: string): void {
    this.internshipService.getInternshipById(internshipId).subscribe(
      internship => {
        if (internship) {
          this.inspectedInternship = internship; // Directly assigning the fetched student
          console.log("inspected internship : " + JSON.stringify(internship))

        } else {
          this.errorMessage = 'Error fetching internship data';
        }
      },
      error => {
        console.error('Error fetching internship', error);
        this.errorMessage = 'Error fetching internship';
      }
    );
  }
  

  goToFicheReponse(internshipId: number): void {
    console.log('Navigating to fiche-reponse for internshipId with ID:', internshipId);
    this.router.navigate(['/fiche-reponse', internshipId]);
  }

  goToDemandeDeStage(internshipId: number): void {
    console.log('Navigating to demande de stage for internshipId with ID:', internshipId);
    this.router.navigate(['/demande-de-stage', internshipId]);
  }

  goToLettreDaffectation(internshipId: number): void {
    console.log('Navigating to lettre daffectation for internshipId with ID:', internshipId);
    this.router.navigate(['/lettre-affectation', internshipId]);
  }

  
}
