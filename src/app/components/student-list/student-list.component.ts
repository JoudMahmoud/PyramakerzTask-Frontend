import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { School } from '../../_models/school';
import { SchoolService } from '../../services/school/school.service';
import { StudentFilter } from '../../_models/student-filter';
import { StudentDtoForDisplay } from '../../_models/student-dto-for-display';
import { ClassRoom } from '../../_models/class-room';
import { ClassRoomService } from '../../services/classRoom/class-room.service';

// Import XLSX and FileSaver for Excel export
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Import jsPDF and html2canvas for PDF export
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-student-list',
  standalone: false,
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  // Array to hold school data from the backend
  schools: School[] = [];
  // Array to hold classroom data from the backend
  classRoom: ClassRoom[] = [];

  // Filters for the student report
  filters: StudentFilter = {
    SchoolId: null,
    Year: null,
    Grade: null,
    ClassRoomId: null,
  };

  // Array to hold the filtered student data
  students: StudentDtoForDisplay[] = [];

  // NEW PROPERTY: holds info about the selected school
  // Adjust fields to match your 'School' model or remove if you prefer dynamic assignment
  public selectedSchool: Partial<School> | null = null;

  constructor(
    private schoolService: SchoolService,
    private classRoomService: ClassRoomService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    // Retrieve schools from the backend
    this.schoolService.getAllSchools().subscribe({
      next: (data) => {
        this.schools = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching schools:', err);
      },
    });

    // Retrieve classrooms from the backend
    this.classRoomService.getAllClassRoom().subscribe({
      next: (response) => {
        this.classRoom = response;
      },
      error: (err) => {
        console.error('Error fetching ClassRooms:', err);
      },
    });

    // Load student data based on filters on component load
    this.getFilteredStudents();
  }

  // Method to get students based on filter criteria
  getFilteredStudents() {
    let params = new HttpParams();

    if (this.filters.SchoolId !== null) {
      params = params.set('SchoolId', String(this.filters.SchoolId));
      // EXAMPLE: set selectedSchool from 'schools' array
      this.selectedSchool =
        this.schools.find((s) => s.id === this.filters.SchoolId) || null;
    } else {
      this.selectedSchool = null;
    }

    if (this.filters.Year !== null) {
      params = params.set('Year', String(this.filters.Year));
    }
    if (this.filters.Grade !== null) {
      params = params.set('Grade', String(this.filters.Grade));
    }
    if (this.filters.ClassRoomId !== null) {
      params = params.set('ClassRoomId', String(this.filters.ClassRoomId));
    }

    this.httpClient
      .get<StudentDtoForDisplay[]>('https://localhost:7147/api/Student', {
        params,
      })
      .subscribe({
        next: (data) => {
          this.students = data;
        },
        error: (err) => {
          console.error('Error fetching students:', err);
        },
      });
  }

  // -------------------------------
  // Export to Excel Functionality
  // -------------------------------
  exportToExcel(): void {
    // Convert the students array into an Excel worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.students);
    // Create a workbook with a sheet named "Students"
    const workbook: XLSX.WorkBook = {
      Sheets: { Students: worksheet },
      SheetNames: ['Students'],
    };
    // Write the workbook to an array buffer in Excel format
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    // Save the file using the helper function
    this.saveAsExcelFile(excelBuffer, 'StudentReport');
  }

  // Helper function to save the Excel file using FileSaver
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  // -------------------------------
  // Export to PDF Functionality
  // -------------------------------
  exportToPDF(): void {
    // Get the element to export (the table with id "studentTable")
    const data = document.getElementById('studentTable');
    if (!data) {
      console.error('Element with id "studentTable" not found.');
      return;
    }
    // Capture the element as a canvas using html2canvas
    html2canvas(data).then((canvas) => {
      const imgWidth = 208; // Width in mm for A4 paper
      const pageHeight = 295; // Height in mm for A4 paper
      // Calculate image height to maintain aspect ratio
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      // Create a new jsPDF instance (portrait, mm, A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      // Add the captured image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      // Save the generated PDF file
      pdf.save('StudentReport_' + new Date().getTime() + '.pdf');
    });
  }

  // -------------------------------
  // Print Report Functionality
  // -------------------------------
  printReport(): void {
    // Open the print dialog for the current page
    window.print();
  }
}
