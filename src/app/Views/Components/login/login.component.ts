import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { User } from '../../../Models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@Component({  
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule , HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  user: User = {
    username: '',
    password: '',
    firstname : '',
    lastname : '' ,
    email : '',
    user_type : 0 ,
  };

  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login(): void {
    this.authService.login(this.user).subscribe(
      (response) => {
        this.authService.handleLogin(response);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = "Invalid credentials";
        console.error('Login failed:', error);
      }
    );
  }
}
