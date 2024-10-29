import { TestBed } from '@angular/core/testing';

import { PayoutServiceService } from './payout-service.service';

describe('PayoutServiceService', () => {
  let service: PayoutServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayoutServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
