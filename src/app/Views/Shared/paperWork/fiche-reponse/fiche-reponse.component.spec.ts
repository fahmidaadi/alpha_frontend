import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheReponseComponent } from './fiche-reponse.component';

describe('FicheReponseComponent', () => {
  let component: FicheReponseComponent;
  let fixture: ComponentFixture<FicheReponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheReponseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FicheReponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
