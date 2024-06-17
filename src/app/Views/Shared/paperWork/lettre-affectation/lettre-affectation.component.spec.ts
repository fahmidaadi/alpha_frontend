import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettreAffectationComponent } from './lettre-affectation.component';

describe('LettreAffectationComponent', () => {
  let component: LettreAffectationComponent;
  let fixture: ComponentFixture<LettreAffectationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LettreAffectationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LettreAffectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
