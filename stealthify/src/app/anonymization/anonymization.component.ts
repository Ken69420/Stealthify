import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MenubarComponent } from '../menubar/menubar.component';

interface AnonymizationResponse {
  fileId: string;
  message: string;
}

interface Settings {
  masking: {
    enabled: boolean;
    emailCharactersToShow: number;
    phoneDigitsToHide: number;
  };
  substitution: {
    enabled: boolean;
    dataset: string;
  };
  generalization: {
    enabled: boolean;
    numberOfCompanies: number;
    totalWorkingYears: number;
    trainingTimesLastYear: number;
    yearsAtCompany: number;
    yearsInCurrentRole: number;
    yearsSinceLastPromotion: number;
    yearsWithCurrManager: number;
  };
  rounding: {
    enabled: boolean;
    distanceFromHome: boolean;
  };
  pseudonymization: {
    enabled: boolean;
    prefix: string;
    randomStrength: number;
  };
  labelEncoding: {
    enabled: boolean;
    gender: boolean;
    maritalStatus: boolean;
  };
}

@Component({
  selector: 'app-anonymization',
  standalone: true,
  imports: [FormsModule, CommonModule, MenubarComponent],
  templateUrl: './anonymization.component.html',
})
export class AnonymizationComponent {
  settings: Settings = {
    masking: {
      enabled: false,
      emailCharactersToShow: 3,
      phoneDigitsToHide: 4,
    },
    substitution: {
      enabled: false,
      dataset: 'Random Names',
    },
    generalization: {
      enabled: false,
      numberOfCompanies: 5,
      totalWorkingYears: 10,
      trainingTimesLastYear: 5,
      yearsAtCompany: 5,
      yearsInCurrentRole: 3,
      yearsSinceLastPromotion: 2,
      yearsWithCurrManager: 2,
    },
    rounding: {
      enabled: false,
      distanceFromHome: false,
    },
    pseudonymization: {
      enabled: false,
      prefix: 'EMP',
      randomStrength: 1,
    },
    labelEncoding: {
      enabled: false,
      gender: false,
      maritalStatus: false,
    },
  };

  datasets = ['Random Names', 'Anonymous IDs', 'Placeholder Text'];
  apiUrl = 'http://localhost:3000/api/anonymization/anonymize';

  constructor(private http: HttpClient) {}

  toggleStatus(section: string, state: boolean) {
    console.log(`${section} is now: ${state ? 'ON' : 'OFF'}`);
  }

  submitAnonymization() {
    console.log('Submitting anonymization settings...', this.settings);

    //Make POST request to the Backend
    this.http
      .post<AnonymizationResponse>(
        this.apiUrl,
        { settings: this.settings },
        { responseType: 'json' }
      )
      .subscribe({
        next: (response) => {
          console.log('Anonymization applied successfully!', response);
          //trigger file download
          const blob = new Blob([JSON.stringify(response)], {
            type: 'application/json',
          });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'anonymized_data.json';
          link.click();
          alert(`Anonymization was successful!`);
        },
        error: (error) => {
          console.error('Error during anonymization:', error);
          alert('Failed to apply anonymization. Please try again.');
        },
      });
  }
}
