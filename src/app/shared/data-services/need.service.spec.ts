/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NeedService } from './need.service';

describe('NeedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NeedService]
    });
  });

  it('should ...', inject([NeedService], (service: NeedService) => {
    expect(service).toBeTruthy();
  }));
});
