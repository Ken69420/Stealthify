import { Component } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privileges',
  standalone: true,
  imports: [RouterModule,MenubarComponent],
  templateUrl: './privileges.component.html',
  styleUrl: './privileges.component.css'
})
export class PrivilegesComponent {

}
