import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  errorMessage: string = '';

  constructor(private AuthService: AuthenticationService, private router:Router){}

  // Handle Login with username and password
  onLogin(event: Event) {
    event.preventDefault();

    this.AuthService.login(this.username, this.password).subscribe(
      (response) => {
        //OTP has been sent , show OTP form
        this.isOtpSent =  true;
        alert('OTP has been sent to your email. Please Enter to continue.');
        /*
        //store the token in localStorage
        localStorage.setItem('authToken', response.token);
        //redirect homepage
        this.router.navigate(['/homepage']);
        */
      },
      (error) =>{
        console.error('Login error:', error);
        this.errorMessage = "Login failed! Please check your username and password";
      }
    );
  }

  //Handle OTP submission
  onVerifyOtp(){
    this.AuthService.verifyOtp(this.username, this.otp).subscribe(
      (response: any) => {
        alert('Login successful!');

        //store the token into local storage
        localStorage.setItem('token',response.token);
        console.log('token stored in localStorage:', response.token);
        this.router.navigate(['/homepage']);
        console.log('navigate to dashboard');
      },
      (err) => {
        this.errorMessage = 'Invalid OTP.';
      }
    );
  }
}
