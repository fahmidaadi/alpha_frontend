import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternshipTypeComponent } from './add-internship-type.component';

describe('AddInternshipTypeComponent', () => {
  let component: AddInternshipTypeComponent;
  let fixture: ComponentFixture<AddInternshipTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInternshipTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInternshipTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
