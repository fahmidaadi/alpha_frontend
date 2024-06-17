import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectStudentComponent } from './inspect-student.component';

describe('InspectStudentComponent', () => {
  let component: InspectStudentComponent;
  let fixture: ComponentFixture<InspectStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
