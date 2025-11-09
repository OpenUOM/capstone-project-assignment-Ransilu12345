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
      this.data = Object.values(response);
      this.teacherData = Object.values(response);
      this.allTeacherData = Object.values(response);
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
    if (value.trim().length === 0) {
      this.teacherData = this.allTeacherData;
    } else {
      this.teacherData = this.allTeacherData.filter((item: any) =>
        item[0].name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  deleteTeacher(id: any) {
    this.service.deleteTeacher({ id }).subscribe(() => {
      this.getTeacherData();
    })
  }
}
