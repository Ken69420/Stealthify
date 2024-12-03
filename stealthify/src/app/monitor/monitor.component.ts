import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css',
})
export class MonitorComponent {
  logs: {
    timestamp: string;
    activity: string;
    user: string;
    severity: string;
  }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('MonitorComponent initialized');
    this.fetchLogs();
  }

  fetchLogs() {
    console.log('Fetching logs...');
    this.http.get<any[]>('http://localhost:3000/api/activity-logs').subscribe(
      (data) => {
        this.logs = data;
      },
      (error) => {
        console.error('Error fetching activity logs:', error);
      }
    );
  }
}
