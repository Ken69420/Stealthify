import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

interface CounterState {
  currentCount: string;
  isRunning: boolean;
  startTime: number | null;
  pausedTime: number;
  target: string;
  progress: number;
  estimatedTimeRemaining: number | null;
}

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit, OnDestroy {
  counterState: CounterState = {
    currentCount: '0',
    isRunning: false,
    startTime: null,
    pausedTime: 0,
    target: '1000000000000000',
    progress: 0,
    estimatedTimeRemaining: null
  };

  private statusSubscription?: Subscription;
  private apiUrl = '/api/counter';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStatus();
    // Poll for status updates every 5 seconds
    this.statusSubscription = interval(5000).subscribe(() => {
      this.loadStatus();
    });
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  loadStatus() {
    this.http.get<{state: CounterState}>(`${this.apiUrl}/status`).subscribe({
      next: (response) => {
        this.counterState = response.state;
      },
      error: (error) => {
        console.error('Error loading counter status:', error);
      }
    });
  }

  startCounter() {
    this.http.post<{state: CounterState}>(`${this.apiUrl}/start`, {}).subscribe({
      next: (response) => {
        this.counterState = response.state;
      },
      error: (error) => {
        console.error('Error starting counter:', error);
      }
    });
  }

  pauseCounter() {
    this.http.post<{state: CounterState}>(`${this.apiUrl}/pause`, {}).subscribe({
      next: (response) => {
        this.counterState = response.state;
      },
      error: (error) => {
        console.error('Error pausing counter:', error);
      }
    });
  }

  resetCounter() {
    if (confirm('Are you sure you want to reset the counter? This will lose all progress.')) {
      this.http.post<{state: CounterState}>(`${this.apiUrl}/reset`, {}).subscribe({
        next: (response) => {
          this.counterState = response.state;
        },
        error: (error) => {
          console.error('Error resetting counter:', error);
        }
      });
    }
  }

  formatNumber(numberStr: string): string {
    // Add commas to large numbers for better readability
    return parseInt(numberStr).toLocaleString();
  }

  formatTime(seconds: number): string {
    if (!seconds) return 'Unknown';
    
    const years = Math.floor(seconds / (365.25 * 24 * 3600));
    const days = Math.floor((seconds % (365.25 * 24 * 3600)) / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (years > 0) {
      return `${years.toLocaleString()} years, ${days} days`;
    } else if (days > 0) {
      return `${days} days, ${hours} hours`;
    } else if (hours > 0) {
      return `${hours} hours, ${minutes} minutes`;
    } else if (minutes > 0) {
      return `${minutes} minutes, ${secs} seconds`;
    } else {
      return `${secs} seconds`;
    }
  }

  getElapsedTime(): string {
    if (!this.counterState.startTime) return 'Not started';
    
    const elapsed = (Date.now() - this.counterState.startTime) / 1000;
    return this.formatTime(elapsed);
  }
}