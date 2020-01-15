import { TestBed } from '@angular/core/testing';

import { BdService } from './bd.service';

describe('BdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BdService = TestBed.get(BdService);
    expect(service).toBeTruthy();
  });
});
