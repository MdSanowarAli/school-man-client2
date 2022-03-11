import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Teacher } from 'src/core/teacher.model';
import { TeacherService } from 'src/core/teacher.service';

@Component({
  selector: 'app-teacher-add-edit',
  templateUrl: './teacher-add-edit.component.html',
  styleUrls: ['./teacher-add-edit.component.css']
})
export class TeacherAddEditComponent implements OnInit {
  onClose: Subject<boolean>;
  teacherObj: Teacher = new Teacher();

  title: any = '';

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private teacherService: TeacherService,
  ) { }

  ngOnInit() {
    console.log('Selected Obj: ', this.teacherObj);
    this.onClose = new Subject();
  }

  saveOrUpdate(): void {
    if (this.teacherObj.id != null || this.teacherObj.id != undefined) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    this.teacherObj.dob = moment(new Date(this.teacherObj.dob)).toDate();
    if (this.teacherObj.firstName != null) {
      this.teacherService.onSaveItem(this.teacherObj).subscribe(
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
    // this.studentObj.dob = moment(new Date(this.studentObj.dob)).toDate();
    if (this.teacherObj.firstName != null) {
      this.teacherService.onUpdateItem(this.teacherObj).subscribe(
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
