import { TestBed } from '@angular/core/testing';

import { SubirInformacionService } from './subir-informacion.service';

describe('SubirInformacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubirInformacionService = TestBed.get(SubirInformacionService);
    expect(service).toBeTruthy();
  });
});
