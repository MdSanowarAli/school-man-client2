import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Common and Others
import { CommonModule } from '@angular/common';

// datatables
import { DataTablesModule } from 'angular-datatables';

//HTTP
import { HttpClientModule } from '@angular/common/http';

// Toastr and animation
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modal
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';

// Date Picker
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';

//tooltip
import { TooltipModule } from 'ngx-bootstrap/tooltip';

//CKEditor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { StudentComponent } from './student/student.component';
import { StudentAddEditComponent } from './student/student-add-edit/student-add-edit.component';
import { TeacherComponent } from './teacher/teacher.component';
import { CourseComponent } from './course/course.component';
import { TeacherAddEditComponent } from './teacher/teacher-add-edit/teacher-add-edit.component';
import { CourseAddEditComponent } from './course/course-add-edit/course-add-edit.component';
import { CourseAssignComponent } from './course-assign/course-assign.component';
import { CourseAssignAddEditComponent } from './course-assign/course-assign-add-edit/course-assign-add-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    StudentAddEditComponent,
    TeacherComponent,
    CourseComponent,
    TeacherAddEditComponent,
    CourseAddEditComponent,
    CourseAssignComponent,
    CourseAssignAddEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DataTablesModule,
    HttpClientModule,
    CKEditorModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [
    BsModalRef
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    StudentAddEditComponent,
    TeacherAddEditComponent,
    CourseAddEditComponent
  ],
})
export class AppModule { }
