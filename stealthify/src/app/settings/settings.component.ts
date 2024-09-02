import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarComponent } from '../menubar/menubar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule,MenubarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
