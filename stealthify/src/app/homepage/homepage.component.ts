import { Component, OnInit } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
      }>(`${environment.apiUrl}/stats`)
      .subscribe(
        (data) => {
          this.stats = {
            totalEntries: data.totalEntries,
            totalDepartments: data.totalDepartments,
            avgSatisfaction: parseFloat(data.avgSatisfaction.toFixed(1)),
          };
        },
        (error) => {
          console.error('Error fetching stats:', error);
          this.errorMessage = 'Failed to load stats. Please try again later.';
        }
      );
  }
}
