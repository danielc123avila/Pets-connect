import { TestBed } from '@angular/core/testing';

import { PeticionService } from './peticionservice.service';

describe('PeticionserviceService', () => {
  let service: PeticionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeticionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
