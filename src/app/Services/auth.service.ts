import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn = this.isLoggedInSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:9000/api/v1'; // API endpoint to fetch user data

  constructor(private http: HttpClient) {
    // Check session storage on initialization
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      this.isLoggedInSubject.next(true);
      this.currentUserSubject.next(JSON.parse(currentUser));
    }
  }

  getUsername(): Observable<string | null> {
    return this.currentUserSubject.pipe(
      map(user => user ? user.username : null)
    );
    
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }


  login(user: User): Observable<User> {
    console.log(user)
    // Perform HTTP POST request to login endpoint
    return this.http.post<User>(`${this.apiUrl}/login`, user).pipe(map(user => {
      localStorage.setItem('currentUser', user.username);
        this.currentUserSubject.next(user);
        return user;
    }));
  }

  handleLogin(user: User) {
    // Set session and update isLoggedInSubject if user is found
    this.isLoggedInSubject.next(true);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    this.isLoggedInSubject.next(false);
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    this.currentUserSubject.next(null);
  }
}
