import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseAssignComponent } from './course-assign/course-assign.component';
import { CourseComponent } from './course/course.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: CourseAssignComponent
  },
  {
    path: 'student',
    component: StudentComponent
  },
  {
    path: 'teacher',
    component: TeacherComponent
  },
  {
    path: 'course',
    component: CourseComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
