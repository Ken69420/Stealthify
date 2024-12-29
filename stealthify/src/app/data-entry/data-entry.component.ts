import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarComponent } from '../menubar/menubar.component';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [FormsModule, CommonModule, MenubarComponent],
  templateUrl: './data-entry.component.html',
})
export class DataEntryComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  message: string = '';
  selectedFile: File | null = null;

  formData: Record<string, any> = {
    employeeId: '',
    gender: '',
    maritalStatus: '',
    email: '',
    phoneNo: '',
    department: '',
    jobRole: '',
    educationField: '',
    distanceFromHome: 0,
    attrition: '',
    environmentSatisfactory: 0,
    jobSatisfaction: 0,
    performanceRating: 0,
    numberOfCompaniesWorked: 0,
    totalWorkingYears: 0,
    trainingTimesLastYear: 0,
    yearsAtCompany: 0,
    yearsInCurrentRole: 0,
    yearsSinceLastPromotion: 0,
    yearsWithCurrentManager: 0,
  };

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile);

    if (this.selectedFile) {
      this.uploadFile();
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.message = 'Please select a file first.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http
      .post('http://localhost:3000/api/employees/upload', formData)
      .subscribe(
        (response: any) => {
          console.log('Response from server:', response);
          this.message = response.message || 'File uploaded successfully.';
        },
        (error) => {
          console.error('Error importing CSV data:', error);
          this.message = 'Error uploading CSV data.';
        }
      );
  }

  submitForm() {
    this.http
      .post('http://localhost:3000/api/employees/save', this.formData)
      .subscribe(
        (response: any) => {
          console.log('Employee data saved:', response);
          this.message = 'Employee data saved successfully.';
          this.resetForm();
        },
        (error) => {
          console.error('Error saving employee data:', error);
          this.message = 'Error saving employee data.';
        }
      );
  }

  resetForm() {
    this.formData = {
      employeeId: '',
      gender: '',
      maritalStatus: '',
      email: '',
      phoneNo: '',
      department: '',
      jobRole: '',
      educationField: '',
      distanceFromHome: 0,
      attrition: '',
      environmentSatisfactory: 0,
      jobSatisfaction: 0,
      performanceRating: 0,
      numberOfCompaniesWorked: 0,
      totalWorkingYears: 0,
      trainingTimesLastYear: 0,
      yearsAtCompany: 0,
      yearsInCurrentRole: 0,
      yearsSinceLastPromotion: 0,
      yearsWithCurrentManager: 0,
    };
  }
}
