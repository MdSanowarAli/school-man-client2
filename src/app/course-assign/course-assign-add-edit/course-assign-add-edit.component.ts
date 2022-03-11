import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CourseAssign } from 'src/core/course-assign.model';
import { CourseAssignService } from 'src/core/course-assign.service';
import { CourseService } from 'src/core/course.service';
import { StudentService } from 'src/core/student.service';
import { TeacherService } from 'src/core/teacher.service';

@Component({
  selector: 'app-course-assign-add-edit',
  templateUrl: './course-assign-add-edit.component.html',
  styleUrls: ['./course-assign-add-edit.component.css']
})
export class CourseAssignAddEditComponent implements OnInit {
  onClose: Subject<boolean>;
  courseList : any = [];
  studentList : any = [];
  teacherList : any = [];
  courseAssignObj: CourseAssign = new CourseAssign();

  selectedTeachStu: any;

  title: any = '';

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private courseAssignService: CourseAssignService,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    this.getCourseList();
    this.getStudentList();
    this.getTeacherList();
  }

  getCourseList() {
    this.courseService.getAllList().subscribe(
      res => {
        if (res.success) {
          this.courseList = res;
          console.log("Course List: ", this.courseList);
        } else {
          this.toastr.warning('', res.message);
        }
      }, err => {
        this.toastr.warning('', err);
      }
    );
  }

  getStudentList() {
    this.studentService.getAllList().subscribe(
      res => {
        if (res.success) {
          this.studentList = res;
          console.log("Course List: ", this.studentList);
        } else {
          this.toastr.warning('', res.message);
        }
      }, err => {
        this.toastr.warning('', err);
      }
    );
  }

  getTeacherList() {
    this.teacherService.getAllList().subscribe(
      res => {
        if (res.success) {
          this.teacherList = res;
          console.log("Course List: ", this.teacherList);
        } else {
          this.toastr.warning('', res.message);
        }
      }, err => {
        this.toastr.warning('', err);
      }
    );
  }

  selectedTeachStuValue(val) {
    this.selectedTeachStu = val;
    console.log("selectedTeachStu:", this.selectedTeachStu );
  }

  setValue(val) {
    console.log("Selected Item:", val );
  }

  saveOrUpdate(): void {
    if (this.courseAssignObj.id != null || this.courseAssignObj.id != undefined) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    // if (this.courseAssignObj.courseId != null) {
      this.courseAssignService.onSaveItem(this.courseAssignObj).subscribe(
        res => {
          if (res.success) {
            this.toastr.success('', res.message);
            this.bsModalRef.hide();
            this.onClose.next(true);
          } else {
            this.toastr.warning('', res.message);
            this.onClose.next(true);
          }
        }, err => {
          console.error('Error occured when save ', err);
          this.toastr.error('Error occured when save', err.message);
          this.bsModalRef.hide();
          this.onClose.next(true);
        }
      );
    // } else {
    //   this.toastr.warning('', "Please Insert Data to All Mendatory Field's...");
    // }

  }

  update(): void {
    // if (this.courseAssignObj.courseId != null) {
      this.courseAssignService.onUpdateItem(this.courseAssignObj).subscribe(
        res => {
          if (res.success) {
            this.toastr.success('', res.message);
            this.bsModalRef.hide();
            this.onClose.next(true);
          } else {
            this.toastr.warning('', res.message);
            this.onClose.next(false);
          }
        }, err => {
          console.error('Error occured when Update', err);
          this.toastr.error('Error occured when Update', err.message);
          this.bsModalRef.hide();
          this.onClose.next(true);
        }
      );
    // } else {
    //   this.toastr.warning('', "Please Insert Data to All Mendatory Field's...");
    // }
  }
}
