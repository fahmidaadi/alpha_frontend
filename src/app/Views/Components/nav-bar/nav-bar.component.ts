import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule  } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [ CommonModule ,
    MatBadgeModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSnackBarModule ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit  {

  username: string | undefined;
  
  constructor(private authService: AuthService , private router : Router) { }
  ngOnInit(): void {
    this.username = this.authService.currentUserValue?.username || 'Guest';

  }

  onSignOut() {
    // Call AuthService's logout method
    this.authService.logout();
    // Navigate to login route after signing out
    this.router.navigate(['/login']);
  }
  
  
}