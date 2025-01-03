import { Component, OnInit } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [MenubarComponent, RouterModule, CommonModule],
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit {
  stats: {
    totalEntries: number;
    totalDepartments: number;
    avgSatisfaction: number;
  } = {
    totalEntries: 0,
    totalDepartments: 0,
    avgSatisfaction: 0,
  };
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.http
      .get<{
        totalEntries: number;
        totalDepartments: number;
        avgSatisfaction: number;
      }>('http://localhost:3000/api/stats')
      .subscribe(
        (data) => {
          console.log('Data received:', data); // Check if avgSatisfaction is present
          this.stats = {
            totalEntries: data.totalEntries,
            totalDepartments: data.totalDepartments,
            avgSatisfaction: data.avgSatisfaction,
          };
        },
        (error) => {
          console.error('Error fetching stats:', error);
          this.errorMessage = 'Failed to load stats. Please try again later.';
        }
      );
  }
}
