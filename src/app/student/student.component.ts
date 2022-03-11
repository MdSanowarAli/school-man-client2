import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/core/student.service';
import { environment } from 'src/environments/environment';
import { StudentAddEditComponent } from './student-add-edit/student-add-edit.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  id: number;
  selectedItem: any;

  @ViewChild('studentGridListTable', { static: true }) studentGridListTable: any;
  studentList: any;
  studentListObj: any;
  dataParam: any = {};

  // For Modal
  bsModalRef: BsModalRef;
  prescroptionBsModalRef: BsModalRef;

  constructor(
    private studentService: StudentService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.studentlistGrid();
  }

  studentlistGrid() {
    let that = this;
    this.studentList = $(this.studentGridListTable.nativeElement);
    this.studentListObj = this.studentList.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: environment.baseUrl + environment.schoolManApiUrl + '/student/grid-list',
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
        //   title: 'Student ID',
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
          title: 'Action',
          className: 'text-center',
          render: function (data, type, row) {
            return '<button class="btn-danger deleteStudent"><i class="fas fa-trash-alt"></i> Delete</button>';
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
        $(row).find('.deleteStudent').click(function () {
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
    this.bsModalRef = this.modalService.show(StudentAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result == true) {
        this.studentListObj.draw();
      }
    });
  }

  edit(): void {
    if (this.selectedItem) {
      this.selectedItem.dob = this.selectedItem.dob ? moment(new Date(this.selectedItem.dob)).format('DD-MM-YYYY') : null;
      const initialState = {
        studentObj: this.selectedItem,
        title: 'Edit Task Form'
      }
      this.bsModalRef = this.modalService.show(StudentAddEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe(result => {
        if (result == true) {
          this.studentListObj.draw();
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
      this.studentService.onDelete(selectedItem.id).subscribe(
        () => {
          this.toastr.success('', "Deleted Successfull")
          this.selectedItem = null;
          this.studentListObj.draw();
        },
        () => {
          this.toastr.warning('', "Not Delete, Please Check")
        }
      )
    }
  }

}
