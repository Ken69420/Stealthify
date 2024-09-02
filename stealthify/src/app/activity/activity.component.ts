import { Component } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [RouterModule,MenubarComponent],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})
export class ActivityComponent {

}
