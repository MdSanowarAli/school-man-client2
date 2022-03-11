import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Student } from 'src/core/student.model';
import { StudentService } from 'src/core/student.service';

@Component({
  selector: 'app-student-add-edit',
  templateUrl: './student-add-edit.component.html',
  styleUrls: ['./student-add-edit.component.css']
})
export class StudentAddEditComponent implements OnInit {
  onClose: Subject<boolean>;
  studentObj: Student = new Student();

  title: any = '';

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private studentService: StudentService,
  ) { }

  ngOnInit() {
    console.log('Selected Obj: ', this.studentObj);
    this.onClose = new Subject();
  }

  saveOrUpdate(): void {
    if (this.studentObj.id != null || this.studentObj.id != undefined) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    this.studentObj.dob = moment(new Date(this.studentObj.dob)).toDate();
    if (this.studentObj.firstName != null) {
      this.studentService.onSaveItem(this.studentObj).subscribe(
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
    this.studentObj.dob = moment(new Date(this.studentObj.dob)).toDate();
    if (this.studentObj.firstName != null) {
      this.studentService.onUpdateItem(this.studentObj).subscribe(
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
