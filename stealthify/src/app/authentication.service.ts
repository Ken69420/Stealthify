import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient, private router:Router) { }

  login(username: string, password: string){
    return this.http.post<{ token:string}>(`${this.baseUrl}/auth/login`, {username,password});
  }

  verifyOtp(username:string, otp: string){
    return this.http.post<{token: string}>(`${this.baseUrl}/auth/verify-otp`,{username,otp});
  }

  register(username: string, password: string){
    return this.http.post<{ messsage: string, token: string}>(`${this.baseUrl}/auth/register`, {username,password});
  }

  isAuthentication(): boolean{
    return !!localStorage.getItem('token'); //check if the token exist
  }

  logout(){
    localStorage.removeItem('token'); //remove the token
    this.router.navigate(['/login']);
  }
}
