import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Course } from 'src/core/course.model';
import { CourseService } from 'src/core/course.service';

@Component({
  selector: 'app-course-add-edit',
  templateUrl: './course-add-edit.component.html',
  styleUrls: ['./course-add-edit.component.css']
})
export class CourseAddEditComponent implements OnInit {
  onClose: Subject<boolean>;
  courseObj: Course = new Course();

  title: any = '';

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private courseService: CourseService,
  ) { }

  ngOnInit() {
    console.log('Selected Obj: ', this.courseObj);
    this.onClose = new Subject();
  }

  saveOrUpdate(): void {
    if (this.courseObj.id != null || this.courseObj.id != undefined) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    if (this.courseObj.courseName != null) {
      this.courseService.onSaveItem(this.courseObj).subscribe(
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
    } else {
      this.toastr.warning('', "Please Insert Data to All Mendatory Field's...");
    }

  }

  update(): void {
    if (this.courseObj.courseName != null) {
      this.courseService.onUpdateItem(this.courseObj).subscribe(
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
    } else {
      this.toastr.warning('', "Please Insert Data to All Mendatory Field's...");
    }
  }
}
