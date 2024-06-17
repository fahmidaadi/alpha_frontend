import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingTypesComponent } from './add-training-types.component';

describe('AddTrainingTypesComponent', () => {
  let component: AddTrainingTypesComponent;
  let fixture: ComponentFixture<AddTrainingTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTrainingTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTrainingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
