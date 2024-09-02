import { Component } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';


@Component({
  selector: 'app-support',
  standalone: true,
  imports: [MenubarComponent],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {

}
