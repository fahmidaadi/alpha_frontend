import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeYearListComponent } from './college-year-list.component';

describe('CollegeYearListComponent', () => {
  let component: CollegeYearListComponent;
  let fixture: ComponentFixture<CollegeYearListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeYearListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollegeYearListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
