import { TestBed } from '@angular/core/testing';

import { InternshipTypeService } from './internship-type.service';

describe('InternshipTypeService', () => {
  let service: InternshipTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternshipTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
