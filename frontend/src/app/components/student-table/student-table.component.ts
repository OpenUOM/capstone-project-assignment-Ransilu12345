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
  studentData: any[] = [];
  allStudentData: any[] = [];
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
      const normalizedData = this.normalizeRows(response);
      this.studentData = [...normalizedData];
      this.allStudentData = [...normalizedData];
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
    const searchTerm = value.trim().toLowerCase();
    if (!searchTerm) {
      this.studentData = [...this.allStudentData];
      return;
    }

    this.studentData = this.allStudentData.filter((student: any) => {
      const name = (student && student.name) ? student.name.toLowerCase() : '';
      return name.includes(searchTerm);
    });
  }

  private normalizeRows(response: any): any[] {
    const values = Array.isArray(response) ? response : Object.values(response || {});
    return values
      .map((item: any) => Array.isArray(item) ? item[0] : item)
      .filter((item: any) => item);
  }
}
