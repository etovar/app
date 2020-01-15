import { TestBed } from '@angular/core/testing';

import { DescargarObraService } from './descargar-obra.service';

describe('DescargarObraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DescargarObraService = TestBed.get(DescargarObraService);
    expect(service).toBeTruthy();
  });
});
