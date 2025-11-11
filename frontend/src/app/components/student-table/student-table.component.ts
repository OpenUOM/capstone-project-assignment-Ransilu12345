import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { faTrash, faPlus, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { AppServiceService } from '../../app-service.service';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css']
})
export class StudentTableComponent implements OnInit {

  faTrash = faTrash;
  faPlus = faPlus;
  faPenSquare = faPenSquare;
  studentData: any;
  allStudentData: any;
  selected: string = 'Students';

  constructor(private service: AppServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getStudentData();
  }

  addNewStudent() {
    this.router.navigate(['addStudent'])
  }

  editStudent(id: any) {
    const navigationExtras: NavigationExtras = {
      state: { id }
    };
    this.router.navigate(['editStudent'], navigationExtras);
  }

  getStudentData() {
    this.service.getStudentData().subscribe((response: any) => {
      const normalized = this.normalizeRecords(response);
      this.studentData = [...normalized];
      this.allStudentData = [...normalized];
    }, (error) => {
      console.log('ERROR - ', error);
    })
  }

  deleteStudent(itemid: any) {
    this.service.deleteStudent({ id: itemid }).subscribe(() => {
      this.getStudentData();
    })
  }

  search(value: string): void {
    if (!Array.isArray(this.allStudentData)) {
      return;
    }

    const query = value?.trim().toLowerCase();

    if (!query) {
      this.studentData = [...this.allStudentData];
      return;
    }

    this.studentData = this.allStudentData.filter((studentWrapper: any) => {
      const student = Array.isArray(studentWrapper) ? studentWrapper[0] : studentWrapper;
      const name = (student?.name ?? '').toString().toLowerCase();
      return name.includes(query);
    });
  }

  private normalizeRecords(response: any): any[] {
    const values = Array.isArray(response) ? response : Object.values(response);
    return values
      .map((entry: any) => Array.isArray(entry) ? entry[0] : entry)
      .filter((entry: any) => !!entry);
  }
}
