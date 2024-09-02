import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [RouterModule,NgClass],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css'
})
export class MenubarComponent {
  constructor(private router: Router){}

  isActive(route: string): boolean{
    return this.router.url === route;
  }
}
