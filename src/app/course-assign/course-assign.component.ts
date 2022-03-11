import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CourseAssign } from 'src/core/course-assign.model';
import { CourseAssignService } from 'src/core/course-assign.service';
import { environment } from 'src/environments/environment';
import { CourseAssignAddEditComponent } from './course-assign-add-edit/course-assign-add-edit.component';

@Component({
  selector: 'app-course-assign',
  templateUrl: './course-assign.component.html',
  styleUrls: ['./course-assign.component.css']
})
export class CourseAssignComponent implements OnInit {
  id: number;
  selectedItem: any;

  @ViewChild('courseAssignGridListTable', { static: true }) courseAssignGridListTable: any;
  courseAssignList: any;
  courseAssignListObj: any;
  dataParam: any = {};

  // For Modal
  bsModalRef: BsModalRef;
  prescroptionBsModalRef: BsModalRef;

  courseAssignObj: CourseAssign = new CourseAssign();
  selectedTeachStu: any;

  constructor(
    private courseAssignService: CourseAssignService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.courseAssignlistGrid();
  }

  courseAssignlistGrid() {
    let that = this;
    this.courseAssignList = $(this.courseAssignGridListTable.nativeElement);
    this.courseAssignListObj = this.courseAssignList.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: environment.baseUrl + environment.schoolManApiUrl + '/course-assign/grid-list',
        type: 'GET',
        data: function (sendData: any) {
          sendData.teacherFlag   = that.selectedTeachStu;
          // if(that.selectedTeachStu == 1) {
          //   sendData.teacherFlag   = that.selectedTeachStu;
          // }
          // else if(that.selectedTeachStu == 0) {
          //   sendData.studentFlag   = that.selectedTeachStu;
          // }
        },
        dataSrc: function (response) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          console.log("response: ", response.obj.data);
          return response.obj.data;

        },
        error: function (request) {
          console.log('request.responseText', request.responseText);
        }
      },
      'order': [[0, 'desc']],
      columns: [
        {
          title: 'SL',
          data: 'id',
          render: function (data, type, row, meta) {
            return '<span>' + (meta.row + 1) + '</span>';
          }
        },
        {
          title: 'Course Id',
          data: 'courseId',
          name: 'courseId',
        },
        {
          title: 'Course Name',
          data: 'courseName',
          name: 'courseName',
        },
        {
          title: 'Assigned Person Id',
          data: 'assignId',
          name: 'assignId',
        },
        {
          title: 'Assigned Person Name',
          data: 'assignName',
          name: 'assignName',
        },
        {
          title: 'Student Teacher Flag',
          data: 'teacherFlag',
          name: 'teacherFlag',
        },
        {
          title: 'Action',
          className: 'text-center',
          render: function (data, type, row) {
            return '<button class="btn-danger deleteCourseAssign"><i class="fas fa-trash-alt"></i> Delete</button>';
          }
        }
      ],
      responsive: true,
      select: true,
      rowCallback: (row: Node, data: any[] | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.selectedItem = data;
          console.log("Selected Patient ", self.selectedItem);
        });
        $(row).find('.deleteCourseAssign').click(function () {
          that.onDelete(data);
        });
        $(row).on('dblclick', () => {
          this.edit();
        });
        return row;
      }
    });
  }

  add(): void {
    const initialState = {
      title: 'Add New Task Form'
    }
    this.bsModalRef = this.modalService.show(CourseAssignAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result == true) {
        this.courseAssignListObj.draw();
      }
    });
  }

  edit(): void {
    if (this.selectedItem) {
      this.selectedItem.dob = this.selectedItem.dob ? moment(new Date(this.selectedItem.dob)).format('DD-MM-YYYY') : null;
      const initialState = {
        courseAssignObj: this.selectedItem,
        title: 'Edit Task Form'
      }
      this.bsModalRef = this.modalService.show(CourseAssignAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe(result => {
        if (result == true) {
          this.courseAssignListObj.draw();
          this.selectedItem = null;
        }
      });
    } else {
      this.toastr.warning('', "Please select an Item")
    }
  }

  onDelete(selectedItem) {
    console.log('Selected Patient for Delete', selectedItem);
    if (selectedItem) {
      this.courseAssignService.onDelete(selectedItem.id).subscribe(
        () => {
          this.toastr.success('', "Deleted Successfull")
          this.selectedItem = null;
          this.courseAssignListObj.draw();
        },
        () => {
          this.toastr.warning('', "Not Delete, Please Check")
        }
      )
    }
  }

  selectedTeachStuValue(val) {
    this.selectedTeachStu = val;
    console.log("selectedTeachStu:", this.selectedTeachStu );
    this.courseAssignlistGrid();
    this.courseAssignListObj.draw();
  }

}
