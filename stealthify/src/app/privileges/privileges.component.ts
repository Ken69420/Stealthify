import { Component } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterModule } from '@angular/router';
import { DataEntryComponent } from '../data-entry/data-entry.component';

@Component({
  selector: 'app-privileges',
  standalone: true,
  imports: [RouterModule,MenubarComponent,DataEntryComponent],
  templateUrl: './privileges.component.html',
  styleUrl: './privileges.component.css'
})
export class PrivilegesComponent {

}
