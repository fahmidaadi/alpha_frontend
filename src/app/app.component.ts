import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './Views/Components/nav-bar/nav-bar.component';
import { SideBarComponent } from './Views/Components/side-bar/side-bar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { CreateInternshipComponent } from './Views/Pages/create-internship/create-internship.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './Services/auth-guard.service';
import { StudentService } from './Services/student.service';
import { DataTablesModule } from 'angular-datatables';
import { DialogService } from './Services/dialog.service';
import { TrainingService } from './Services/training.service';
import { InternshipTypeService } from './Services/internship-type.service';
import { TrainingTypeService } from './Services/training-type.service';
import { ClassService } from './Services/class.service';
import { InternshipService } from './Services/internship.service';
import { DepartmentService } from './Services/department.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './Services/user.service';
import { AuthInterceptorService } from './Services/auth-interceptor.service';
import { PopupMessageService } from './Services/popup-message.service';
import { PopupMessageComponent } from "./Views/Shared/popup-message/popup-message.component";
import { SupervisorService } from './Services/supervisor.service';
import { ProjectService } from './Services/project.service';
import { OrganismeService } from './Services/organisme.service';
import { CollegeYearService } from './Services/college-year.service';
import { ParcourService } from './Services/parcour.service';
import { UserTypeService } from './Services/user-type.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [
        HttpClientModule,
        AuthService,
        AuthGuard,
        StudentService,
        DialogService,
        TrainingService,
        InternshipTypeService,
        TrainingTypeService,
        ClassService,
        InternshipService,
        DepartmentService,
        DatePipe,
        ReactiveFormsModule,
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        PopupMessageService,
        SupervisorService , 
        ProjectService , 
        OrganismeService , 
        CollegeYearService,
        ParcourService,
        UserTypeService,
        
    ],
    imports: [
        RouterOutlet,
        NavBarComponent,
        SideBarComponent,
        CommonModule,
        CreateInternshipComponent,
        HttpClientModule,
        DataTablesModule,
        PopupMessageComponent,
         

    ]
})
export class AppComponent {
  title = 'Alpha';

  constructor(public authService: AuthService) {}

}
