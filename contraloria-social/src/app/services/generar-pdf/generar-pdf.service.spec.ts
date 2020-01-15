import { TestBed } from '@angular/core/testing';

import { GenerarPdfService } from './generar-pdf.service';

describe('GenerarPdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerarPdfService = TestBed.get(GenerarPdfService);
    expect(service).toBeTruthy();
  });
});
