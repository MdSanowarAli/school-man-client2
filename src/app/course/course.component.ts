import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/core/course.service';
import { environment } from 'src/environments/environment';
import { CourseAddEditComponent } from './course-add-edit/course-add-edit.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  id: number;
  selectedItem: any;

  @ViewChild('courseGridListTable', { static: true }) courseGridListTable: any;
  courseList: any;
  courseListObj: any;
  dataParam: any = {};

  // For Modal
  bsModalRef: BsModalRef;
  prescroptionBsModalRef: BsModalRef;

  constructor(
    private courseService: CourseService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.courselistGrid();
  }

  courselistGrid() {
    let that = this;
    this.courseList = $(this.courseGridListTable.nativeElement);
    this.courseListObj = this.courseList.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: environment.baseUrl + environment.schoolManApiUrl + '/course/grid-list',
        type: 'GET',
        data: function (sendData: any) {
          // sendData.id   = that.dataParam.id;
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
        // {
        //   title: 'Course ID',
        //   data: 'id',
        // },
        {
          title: 'Course Name',
          data: 'courseName',
          name: 'courseName',
        },
        {
          title: 'Duration',
          data: 'courseDuration',
          name: 'courseDuration',
        }, 
        {
          title: 'Description',
          data: 'description',
          name: 'description',
        },       
        {
          title: 'Action',
          className: 'text-center',
          render: function (data, type, row) {
            return '<button class="btn-danger deleteCourse"><i class="fas fa-trash-alt"></i> Delete</button>';
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
        $(row).find('.deleteCourse').click(function () {
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
    this.bsModalRef = this.modalService.show(CourseAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result == true) {
        this.courseListObj.draw();
      }
    });
  }

  edit(): void {
    if (this.selectedItem) {
      const initialState = {
        courseObj: this.selectedItem,
        title: 'Edit Task Form'
      }
      this.bsModalRef = this.modalService.show(CourseAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe(result => {
        if (result == true) {
          this.courseListObj.draw();
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
      this.courseService.onDelete(selectedItem.id).subscribe(
        () => {
          this.toastr.success('', "Deleted Successfull")
          this.selectedItem = null;
          this.courseListObj.draw();
        },
        () => {
          this.toastr.warning('', "Not Delete, Please Check")
        }
      )
    }
  }

}
