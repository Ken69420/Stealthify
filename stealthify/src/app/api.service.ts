import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/data'; // Node.js server URL

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    const token = localStorage.getItem('token') //get the token from local storage

    //set the headers for the request if there is token
    const headers = token ? new HttpHeaders().set(`Authorization`,`Bearer ${{token}}`) :{};
    return this.http.get<any>(`${this.baseUrl}`, headers);
  }
}