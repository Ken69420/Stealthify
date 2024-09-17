import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private AuthService: AuthenticationService, private router:Router){}

  onLogin(event: Event) {
    event.preventDefault();

    this.AuthService.login(this.username, this.password).subscribe(
      (response) => {
        //store the token in localStorage
        localStorage.setItem('authToken', response.token);
        //redirect homepage
        this.router.navigate(['/homepage']);
      },
      (error) =>{
        alert('login failed!');
      }
    );
  }
}
