import { Component } from '@angular/core';
import { StudentListTableComponent } from '../../Components/student-list-table/student-list-table.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [StudentListTableComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {

}
