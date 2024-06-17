import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentListTableComponent } from './student-list-table.component';

describe('StudentListTableComponent', () => {
  let component: StudentListTableComponent;
  let fixture: ComponentFixture<StudentListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
