import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipTableRowV2Component } from './internship-table-row-v2.component';

describe('InternshipTableRowV2Component', () => {
  let component: InternshipTableRowV2Component;
  let fixture: ComponentFixture<InternshipTableRowV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipTableRowV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternshipTableRowV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
