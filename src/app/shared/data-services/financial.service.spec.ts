import { TestBed, inject } from '@angular/core/testing';

import { FinancialService } from './financial.service';

describe('FinancialService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancialService]
    });
  });

  it('should ...', inject([FinancialService], (service: FinancialService) => {
    expect(service).toBeTruthy();
  }));
});
