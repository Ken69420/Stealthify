import { Component } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [MenubarComponent],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent {

}
