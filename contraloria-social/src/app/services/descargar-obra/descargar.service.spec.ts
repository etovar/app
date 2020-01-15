import { TestBed } from '@angular/core/testing';

import { DescargarService } from './descargar.service';

describe('DescargarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DescargarService = TestBed.get(DescargarService);
    expect(service).toBeTruthy();
  });
});
