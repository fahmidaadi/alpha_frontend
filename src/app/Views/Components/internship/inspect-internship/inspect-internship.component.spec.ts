import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectInternshipComponent } from './inspect-internship.component';

describe('InspectInternshipComponent', () => {
  let component: InspectInternshipComponent;
  let fixture: ComponentFixture<InspectInternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectInternshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectInternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
