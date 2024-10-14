import { Component, OnInit } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [MenubarComponent,RouterModule,CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{
  data: any;
  dataFromBackend: string = ' ';

  constructor(private apiService:ApiService){}

  ngOnInit(): void {
    this.apiService.getData().subscribe(
      (response) => {
        this.data = response;
        console.log('Response from backend: ', response);
        this.dataFromBackend = response.message; // Ensure response.message exists
      },
      (error) => {
        console.error('Error fetching data:', error); // Log error if fetching fails
        this.dataFromBackend = 'Error fetching data.'; // Show user-friendly message
    });
  }

}
