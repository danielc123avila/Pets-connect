import { TestBed } from '@angular/core/testing';

import { PeticionserviceService } from './peticionservice.service';

describe('PeticionserviceService', () => {
  let service: PeticionserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeticionserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
