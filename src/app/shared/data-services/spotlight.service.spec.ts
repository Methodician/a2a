import { TestBed, inject } from '@angular/core/testing';

import { SpotlightService } from './spotlight.service';

describe('SpotlightService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpotlightService]
    });
  });

  it('should ...', inject([SpotlightService], (service: SpotlightService) => {
    expect(service).toBeTruthy();
  }));
});
