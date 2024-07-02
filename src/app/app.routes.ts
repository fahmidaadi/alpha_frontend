import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Views/Components/login/login.component';
import { DashboardComponent } from './Views/Pages/dashboard/dashboard.component';
import { CreateInternshipComponent } from './Views/Pages/create-internship/create-internship.component';
import { InternshipListComponent } from './Views/Components/internship/internship-list/internship-list.component';
import { AuthGuard } from './Services/auth-guard.service';
import { StudentListComponent } from './Views/Pages/student-list/student-list.component';
import { AddStudentComponent } from './Views/Components/Student-CRUD/add-student/add-student.component';
import { InspectStudentComponent } from './Views/Components/Student-CRUD/inspect-student/inspect-student.component';
import { TrainingListComponent } from './Views/Components/training/training-list/training-list.component';
import { InternshipTypeListComponent } from './Views/Components/internship/internship-type-list/internship-type-list.component';
import { AddTrainingComponent } from './Views/Components/training/add-training/add-training.component';
import { TrainingTypesComponent } from './Views/Components/training/training-types/training-types.component';
import { AddInternshipTypeComponent } from './Views/Components/internship/add-internship-type/add-internship-type.component';
import { AddTrainingTypesComponent } from './Views/Components/training/add-training-types/add-training-types.component';
import { ClassListComponent } from './Views/Components/class/class-list/class-list.component';
import { AddClassComponent } from './Views/Components/class/add-class/add-class.component';
import { DemandeDeStageComponent } from './Views/Shared/paperWork/demande-de-stage/demande-de-stage.component';
import { LettreAffectationComponent } from './Views/Shared/paperWork/lettre-affectation/lettre-affectation.component';
import { FicheReponseComponent } from './Views/Shared/paperWork/fiche-reponse/fiche-reponse.component';
import { DepartmentListComponent } from './Views/Components/department/department-list/department-list.component';
import { AddDepartmentComponent } from './Views/Components/department/add-department/add-department.component';
import { AddInternshipComponent } from './Views/Components/internship/add-internship/add-internship.component';
import { InspectInternshipComponent } from './Views/Components/internship/inspect-internship/inspect-internship.component';
import { UserListComponent } from './Views/Components/user/user-list/user-list.component';
import { OrganismeListComponent } from './Views/Components/organisme/organisme-list/organisme-list.component';
import { AddOrganismeComponent } from './Views/Components/organisme/add-organisme/add-organisme.component';
import { ProjectsListComponent } from './Views/Components/projects/projects-list/projects-list.component';
import { SupervisorListComponent } from './Views/Components/supervisor/supervisor-list/supervisor-list.component';
import { CollegeYearListComponent } from './Views/Components/collegeYear/college-year-list/college-year-list.component';
import { AddCollegeYearComponent } from './Views/Components/collegeYear/add-college-year/add-college-year.component';
import { ParcourListComponent } from './Views/Components/parcour/parcour-list/parcour-list.component';
import { AddParcourComponent } from './Views/Components/parcour/add-parcour/add-parcour.component';
import { AddSupervisorComponent } from './Views/Components/supervisor/add-supervisor/add-supervisor.component';
import { AddUserComponent } from './Views/Components/user/add-user/add-user.component';
import { UserTypeListComponent } from './Views/Components/userType/user-type-list/user-type-list.component';
import { AddUserTypeComponent } from './Views/Components/userType/add-user-type/add-user-type.component';
import { AddProjectComponent } from './Views/Components/projects/add-project/add-project.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: DashboardComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'upload-file',
    component: CreateInternshipComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'user-list',
    component: UserListComponent,
  },
  {
    path: 'user-list/add',
    component: AddUserComponent,
  },

  {
    path: 'user-type-list',
    component: UserTypeListComponent,
  },
  
  {
    path: 'user-type-list/add',
    component: AddUserTypeComponent,
  },

  
  {
    path: 'internship-list',
    component: InternshipListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'internship-list/add',
    component: AddInternshipComponent
    //canActivate: [AuthGuard]
  },
  {
    path: 'internship-list/details/:id',
    component: InspectInternshipComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'student-list',
    component: StudentListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'student/add',
    component: AddStudentComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'student/details/:id',
    component: InspectStudentComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'training-list',
    component: TrainingListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'training-list/add',
    component: AddTrainingComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'training-type-list',
    component: TrainingTypesComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'training-types/add',
    component: AddTrainingTypesComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'internship-types-list',
    component: InternshipTypeListComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'internship-types-list/add',
    component: AddInternshipTypeComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'classes-list',
    component: ClassListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'classes-list/add',
    component: AddClassComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'demande-de-stage',
    component: DemandeDeStageComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'demande-de-stage/:internshipId/:etudiantCin',
    component: DemandeDeStageComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'lettre-affectation',
    component: LettreAffectationComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'lettre-affectation/:internshipId/:etudiantCin',
    component: LettreAffectationComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'fiche-reponse',
    component: FicheReponseComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'fiche-reponse/:internshipId/:etudiantCin',
    component: FicheReponseComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'department-list',
    component: DepartmentListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'department-list/add',
    component: AddDepartmentComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'organisme-list',
    component: OrganismeListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'organisme-list/add',
    component: AddOrganismeComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'projects-list',
    component: ProjectsListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'projects-list/add',
    component: AddProjectComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'supervisor-list',
    component: SupervisorListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'supervisor-list/add',
    component: AddSupervisorComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'college-year-list',
    component: CollegeYearListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'college-year-list/add',
    component: AddCollegeYearComponent,
    //canActivate: [AuthGuard]
  },

  {
    path: 'parcour-list',
    component: ParcourListComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'parcour-list/add',
    component: AddParcourComponent,
    //canActivate: [AuthGuard]
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
