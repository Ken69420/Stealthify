import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomepageComponent } from "./homepage/homepage.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, HomepageComponent],
  template: `
      <main>
          <router-outlet></router-outlet>
      </main>

  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stealthify';
}
