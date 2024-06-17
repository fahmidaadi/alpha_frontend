import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          // User is not logged in, redirect to login
          this.router.navigate(['/login']);
          return false;
        }
        // User is logged in, allow access
        return true;
      })
    );
  }
}
