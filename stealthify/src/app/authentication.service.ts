import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, {
      username,
      password,
    });
  }

  verifyOtp(username: string, otp: string) {
    return this.http.post<{ token: string }>(
      `${this.baseUrl}/auth/verify-otp`,
      { username, otp }
    );
  }

  register(username: string, password: string) {
    return this.http.post<{ messsage: string; token: string }>(
      `${this.baseUrl}/auth/register`,
      { username, password }
    );
  }

  isAuthentication(): boolean {
    const token = localStorage.getItem('token');
    console.log('Checking authentication, token:', token);
    return !!token; // Check if the token exists
  }

  logout() {
    localStorage.removeItem('token'); //remove the token
    this.router.navigate(['/login']);
  }
}
