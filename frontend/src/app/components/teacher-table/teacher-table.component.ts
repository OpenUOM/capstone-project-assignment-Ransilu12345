import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { faTrash, faPlus, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { AppServiceService } from '../../app-service.service';
@Component({
  selector: 'app-teacher-table',
  templateUrl: './teacher-table.component.html',
  styleUrls: ['./teacher-table.component.css']
})
export class TeacherTableComponent implements OnInit {

  faTrash = faTrash;
  faPlus = faPlus;
  faPenSquare = faPenSquare;
  data: any;
  teacherData: any[] = [];
  allTeacherData: any[] = [];
  selected: string = 'Teachers';

  constructor(private service: AppServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getTeacherData();
  }

  addNewTeacher() {
    this.router.navigate(['addTeacher'])
  }

  editTeacher(id: any) {
    const navigationExtras: NavigationExtras = {
      state: { id }
    };
    this.router.navigate(['editTeacher'], navigationExtras)
  }

  initializeDB() {
    this.service.initializeDB().subscribe(() => {
      console.log('DB is Initialized')
    }, (error) => {
      console.log('ERROR - ', error)
    })
  }

  getTeacherData() {
    this.selected = 'Teachers';
    this.service.getTeacherData().subscribe((response: any) => {
      const normalizedData = this.normalizeRows(response);
      this.data = normalizedData;
      this.teacherData = [...normalizedData];
      this.allTeacherData = [...normalizedData];
    }, (error) => {
      console.log('ERROR - ', error)
    })
  }

  getStudentData() {
    this.selected = 'Students';
    this.service.getStudentData().subscribe((response: any) => {
      this.data = Object.values(response);
    }, (error) => {
      console.log('ERROR - ', error)
    })
  }

  search(value: string): void {
    const searchTerm = value.trim().toLowerCase();
    if (!searchTerm) {
      this.teacherData = [...this.allTeacherData];
      return;
    }

    this.teacherData = this.allTeacherData.filter((teacher: any) => {
      const name = (teacher && teacher.name) ? teacher.name.toLowerCase() : '';
      return name.includes(searchTerm);
    });
  }

  deleteTeacher(id: any) {
    this.service.deleteTeacher({ id }).subscribe(() => {
      this.getTeacherData();
    })
  }

  private normalizeRows(response: any): any[] {
    const values = Array.isArray(response) ? response : Object.values(response || {});
    return values
      .map((item: any) => Array.isArray(item) ? item[0] : item)
      .filter((item: any) => item);
  }
}
