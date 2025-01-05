import { Component, ViewChild, ElementRef } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-deanonymization',
  standalone: true,
  imports: [MenubarComponent, CommonModule],
  templateUrl: './deanonymization.component.html',
})
export class DeanonymizationComponent {
  fileName: string = '';
  fileDetailsVisible: boolean = false;
  tableData: { field: string; anonymized: string; original: string }[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  downloadLink: string = '';

  constructor(private http: HttpClient) {}

  //trigger file input click
  triggerFileInput(): void {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fileInput?.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.fileDetailsVisible = true;

      // Dummy data for demonstration purposes
      this.tableData = [];
      this.downloadLink = '';
    }
  }

  processDeAnonymization(): void {
    if (!this.fileName) {
      alert('Please upload a JSON file first');
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; // reset previous

    // Access the file input directly for the selected file
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    //Check if a file is selected
    if (!fileInput?.files?.length) {
      this.isLoading = false;
      this.errorMessage = 'No file selected. Please upload a file.';
      return;
    }
    // Create form data to send the file to the backend
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Send the file to backend3
    this.http
      .post(`${environment.apiUrl}/deanonymization/deanonymize`, formData)
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.errorMessage =
            'Error during de-anonymization. Please try again later.';
          console.error('Error: ', error);
          return throwError(error);
        })
      )
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.data) {
            this.tableData = response.data;
          }
          if (response.downloadLink) {
            this.downloadLink = response.downloadLink;
          }
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  //Download the de-anonymized JSON file
  downloadFile(): void {
    if (this.downloadLink) {
      const link = document.createElement('a');
      link.href = this.downloadLink;
      link.download = 'deanonymized_data.json';

      //append the link to the document body
      document.body.appendChild(link);

      //Trigger the click event to start  the download
      link.click();

      //Remove the link after download is initiated
      document.body.removeChild(link);
    } else {
      alert('No file available for download. Please try again.');
    }
  }
}
