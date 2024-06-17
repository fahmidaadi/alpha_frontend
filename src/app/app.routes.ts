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
    path: 'demande-de-stage/:internshipId',
    component: DemandeDeStageComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'lettre-affectation',
    component: LettreAffectationComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'lettre-affectation/:internshipId',
    component: LettreAffectationComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'fiche-reponse',
    component: FicheReponseComponent,
    //canActivate: [AuthGuard]
  },
  {
    path: 'fiche-reponse/:internshipId',
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
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
