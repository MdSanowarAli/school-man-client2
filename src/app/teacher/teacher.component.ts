import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TeacherService } from 'src/core/teacher.service';
import { environment } from 'src/environments/environment';
import { TeacherAddEditComponent } from './teacher-add-edit/teacher-add-edit.component';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  id: number;
  selectedItem: any;

  @ViewChild('teacherGridListTable', { static: true }) teacherGridListTable: any;
  teacherList: any;
  teacherListObj: any;
  dataParam: any = {};

  // For Modal
  bsModalRef: BsModalRef;
  prescroptionBsModalRef: BsModalRef;
  constructor(
    private teacherService: TeacherService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.teacherlistGrid();
  }

  teacherlistGrid() {
    let that = this;
    this.teacherList = $(this.teacherGridListTable.nativeElement);
    this.teacherListObj = this.teacherList.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: environment.baseUrl + environment.schoolManApiUrl + '/teacher/grid-list',
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
        //   title: 'Teacher ID',
        //   data: 'id',
        // },
        {
          title: 'First Name',
          data: 'firstName',
          name: 'firstName',
        },
        {
          title: 'Last Name',
          data: 'lastName',
          name: 'lastName',
        },
        {
          title: 'Date of Birth',
          data: 'dob',
          render: (data) => {
            return moment(data).format("DD/MM/YYYY")
          }
        },
        {
          title: 'Phone',
          data: 'phone',
          name: 'phone',
        },
        {
          title: 'Mobile',
          data: 'mobile',
          name: 'mobile',
        },
        {
          title: 'Qualification',
          data: 'qualification',
          name: 'qualification',
        },
        {
          title: 'Action',
          className: 'text-center',
          render: function (data, type, row) {
            return '<button class="btn-danger deleteTeacher"><i class="fas fa-trash-alt"></i> Delete</button>';
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
        $(row).find('.deleteTeacher').click(function () {
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
    this.bsModalRef = this.modalService.show(TeacherAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result == true) {
        this.teacherListObj.draw();
      }
    });
  }

  edit(): void {
    if (this.selectedItem) {
      this.selectedItem.dob = this.selectedItem.dob ? moment(new Date(this.selectedItem.dob)).format('DD-MM-YYYY') : null;
      const initialState = {
        teacherObj: this.selectedItem,
        title: 'Edit Task Form'
      }
      this.bsModalRef = this.modalService.show(TeacherAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe(result => {
        if (result == true) {
          this.teacherListObj.draw();
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
      this.teacherService.onDelete(selectedItem.id).subscribe(
        () => {
          this.toastr.success('', "Deleted Successfull")
          this.selectedItem = null;
          this.teacherListObj.draw();
        },
        () => {
          this.toastr.warning('', "Not Delete, Please Check")
        }
      )
    }
  }

}
