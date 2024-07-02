import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule , MatIconModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  isSubMenuOpen = false;
  isdocumentSubMenuOpen=false ;
  isSuperAdminSubMenuOpen = false ;

  
  constructor(private router: Router, private authService: AuthService) {}
  
 
  onSignOut() {
    // Call AuthService's logout method
    this.authService.logout();
    // Navigate to login route after signing out
    this.router.navigate(['/login']);
  }

  goToFileUploader(){
    this.router.navigate(['/upload-file']);
  }

  goToDashboard(){
    this.router.navigate(['/home']);
  }

  goToInternshipList(){
    this.router.navigate(['/internship-list']);
  }

  goToStudentList(){
    this.router.navigate(['/student-list']);
  }

  goToTraining(){
    this.router.navigate(['/training-list']);
  }

  goToTrainingTypes(){
    this.router.navigate(['/training-type-list']);
  }

  goToInternshipTypeList(){
    this.router.navigate(['/internship-types-list']);
  }

  goToClassList(){
    this.router.navigate(['/classes-list']);
  }
  goToDepartmentList(){
    this.router.navigate(['/department-list']);
  }
  goToOrganismeList(){
    this.router.navigate(['/organisme-list']);
  }
  goToProjectsList(){
    this.router.navigate(['/projects-list']);
  }

  goToSupervisorList(){
    this.router.navigate(['/supervisor-list']);
  }
  goToCollegeYearList(){
    this.router.navigate(['/college-year-list']);
  }
  goToParcourList(){
    this.router.navigate(['/parcour-list']);
  }
 




  goToDemandeDeStage(){
    this.router.navigate(['/demande-de-stage']);
  }
  goToLettreAffectation(){
    this.router.navigate(['/lettre-affectation']);
  }


  goToFicheReponse(){
    this.router.navigate(['/fiche-reponse']);

  }


  goToUserList(){
    this.router.navigate(['/user-list']);
  }
  goToUserTypeList(){
    this.router.navigate(['/user-type-list']);

  }


  toggleSettingsSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
  toggleDocumentsSubMenu() {
    this.isdocumentSubMenuOpen = !this.isdocumentSubMenuOpen;
  }
  toggleSuperAdminSubMenu() {
    this.isSuperAdminSubMenuOpen = !this.isSuperAdminSubMenuOpen;
  }
}
