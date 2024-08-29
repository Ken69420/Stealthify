import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router){}

  login() {
    if (this.username && this.password){
      this.router.navigate(['/homepage']);
    }else {
      this.router.navigate(['/homepage']);
      //alert ('Please enter both username and password');
    }
  }
}
