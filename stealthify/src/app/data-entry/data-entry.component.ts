import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './data-entry.component.html',
  styleUrl: './data-entry.component.css'
})
export class DataEntryComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  employeeId: string = '';
  gender: string = '';
  maritalStatus: string = '';
  department: string = '';
  jobRole: string = '';
  educationField: string = '';
  distanceFromHome: number = 0;
  attrition: string = '';
  environmentSatisfactory: number = 0;
  jobSatisfaction: number = 0;
  performanceRating: number = 0;
  numberOfCompaniesWorked: number = 0;
  totalWorkingYears: number = 0;
  trainingTimesLastYear: number = 0;
  yearsAtCompany: number = 0;
  yearsInCurrentRole: number = 0;
  yearsSinceLastPromotion: number = 0;
  yearsWithCurrentManager: number = 0;
  message: string = '';
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile); // Log the selected file

    if(this.selectedFile){
      this.onImport();
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onImport() {
    if (!this.selectedFile) {
      this.message = 'Please select a file first.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    console.log('Sending file to server:', this.selectedFile); // Log the file being sent

    this.http.post('http://localhost:3000/api/employees/upload', formData).subscribe(
      (response: any) => {
        console.log('Response from the server:', response); // Log the response
        this.message = response.message;
      },
      (error) => {
        console.error('Error importing CSV data:', error);
        this.message = 'Error importing CSV data.';
      }
    );
  }

  onSubmit() {
    const employeeData = {
      employeeId: this.employeeId,
      gender: this.gender,
      maritalStatus: this.maritalStatus,
      department: this.department,
      jobRole: this.jobRole,
      educationField: this.educationField,
      distanceFromHome: this.distanceFromHome,
      attrition: this.attrition,
      environmentSatisfactory: this.environmentSatisfactory,
      jobSatisfaction: this.jobSatisfaction,
      performanceRating: this.performanceRating,
      numberOfCompaniesWorked: this.numberOfCompaniesWorked,
      totalWorkingYears: this.totalWorkingYears,
      trainingTimesLastYear: this.trainingTimesLastYear,
      yearsAtCompany: this.yearsAtCompany,
      yearsInCurrentRole: this.yearsInCurrentRole,
      yearsSinceLastPromotion: this.yearsSinceLastPromotion,
      yearsWithCurrentManager: this.yearsWithCurrentManager
    };

    this.http.post('http://localhost:3000/api/employees/save', employeeData).subscribe(
      (response: any) => {
        this.message = response.message;
      },
      (error) => {
        console.error('Error saving employee data:', error);
        this.message = 'Error saving employee data.';
      }
    );
  }
}
