import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Views/Components/login/login.component';
import { DashboardComponent } from './Views/Pages/dashboard/dashboard.component';
import { CreateInternshipComponent } from './Views/Pages/create-internship/create-internship.component';
import { InternshipListComponent } from './Views/Components/internship/internship-list/internship-list.component';
import { AuthGuard } from './Services/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'upload-file',
    component: CreateInternshipComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'internship-list',
    component: InternshipListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
