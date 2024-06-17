import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTypesComponent } from './training-types.component';

describe('TrainingTypesComponent', () => {
  let component: TrainingTypesComponent;
  let fixture: ComponentFixture<TrainingTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
