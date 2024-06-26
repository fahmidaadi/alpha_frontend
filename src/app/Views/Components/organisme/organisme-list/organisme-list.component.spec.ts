import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismeListComponent } from './organisme-list.component';

describe('OrganismeListComponent', () => {
  let component: OrganismeListComponent;
  let fixture: ComponentFixture<OrganismeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganismeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganismeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
