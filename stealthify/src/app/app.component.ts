import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  template: `
      <main>
          <app-login></app-login>
      </main>

  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stealthify';
}
