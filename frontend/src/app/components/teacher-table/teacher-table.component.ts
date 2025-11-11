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
  teacherData: any;
  allTeacherData: any;
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
      const normalized = this.normalizeRecords(response);
      this.data = normalized;
      this.teacherData = [...normalized];
      this.allTeacherData = [...normalized];
    }, (error) => {
      console.log('ERROR - ', error)
    })
  }

  getStudentData() {
    this.selected = 'Students';
    this.service.getStudentData().subscribe((response: any) => {
      this.data = this.normalizeRecords(response);
    }, (error) => {
      console.log('ERROR - ', error)
    })
  }

  search(value: string): void {
    if (!Array.isArray(this.allTeacherData)) {
      return;
    }

    const query = value?.trim().toLowerCase();

    if (!query) {
      this.teacherData = [...this.allTeacherData];
      return;
    }

    this.teacherData = this.allTeacherData.filter((teacherWrapper: any) => {
      const teacher = Array.isArray(teacherWrapper) ? teacherWrapper[0] : teacherWrapper;
      const name = (teacher?.name ?? '').toString().toLowerCase();
      return name.includes(query);
    });
  }

  deleteTeacher(id: any) {
    this.service.deleteTeacher({ id }).subscribe(() => {
      this.getTeacherData();
    })
  }

  private normalizeRecords(response: any): any[] {
    const values = Array.isArray(response) ? response : Object.values(response);
    return values
      .map((entry: any) => Array.isArray(entry) ? entry[0] : entry)
      .filter((entry: any) => !!entry);
  }
}
