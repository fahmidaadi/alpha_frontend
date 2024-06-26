import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollegeYearComponent } from './add-college-year.component';

describe('AddCollegeYearComponent', () => {
  let component: AddCollegeYearComponent;
  let fixture: ComponentFixture<AddCollegeYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCollegeYearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCollegeYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
