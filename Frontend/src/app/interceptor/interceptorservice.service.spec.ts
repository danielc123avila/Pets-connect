import { TestBed } from '@angular/core/testing';

import { InterceptorserviceService } from './interceptorservice.service';

describe('InterceptorserviceService', () => {
  let service: InterceptorserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterceptorserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
