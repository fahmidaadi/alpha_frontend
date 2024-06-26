import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParcourComponent } from './add-parcour.component';

describe('AddParcourComponent', () => {
  let component: AddParcourComponent;
  let fixture: ComponentFixture<AddParcourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddParcourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddParcourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
