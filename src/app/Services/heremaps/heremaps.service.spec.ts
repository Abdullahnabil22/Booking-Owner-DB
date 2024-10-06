import { TestBed } from '@angular/core/testing';

import { HeremapsService } from './heremaps.service';

describe('HeremapsService', () => {
  let service: HeremapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeremapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
