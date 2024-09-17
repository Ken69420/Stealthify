import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = 'http://localhost:3000/api/login';
  constructor(private http: HttpClient, private router:Router) { }

  login(username: string, password: string){
    return this.http.post<{ token:string}>(`${this.baseUrl}`, {username,password});
  }

  isAuthentication(): boolean{
    return !!localStorage.getItem('authToken'); //check if the token exist
  }

  logout(){
    localStorage.removeItem('authToken'); //remove the token
    this.router.navigate(['/login']);
  }
}
