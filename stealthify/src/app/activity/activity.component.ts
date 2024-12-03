import { Component } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterModule } from '@angular/router';
import { MonitorComponent } from '../monitor/monitor.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [RouterModule, MenubarComponent, MonitorComponent, CommonModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
})
export class ActivityComponent {
  constructor() {
    console.log('ActivityComponent initialized');
  }
}
