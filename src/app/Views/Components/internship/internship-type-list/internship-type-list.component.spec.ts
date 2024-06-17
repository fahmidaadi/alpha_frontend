import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipTypeListComponent } from './internship-type-list.component';

describe('InternshipTypeListComponent', () => {
  let component: InternshipTypeListComponent;
  let fixture: ComponentFixture<InternshipTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipTypeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternshipTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
