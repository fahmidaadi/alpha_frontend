import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipDetailsButtonComponent } from './internship-details-button.component';

describe('InternshipDetailsButtonComponent', () => {
  let component: InternshipDetailsButtonComponent;
  let fixture: ComponentFixture<InternshipDetailsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipDetailsButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternshipDetailsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
