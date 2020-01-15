import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarIntegrantePage } from './agregar-integrante.page';

describe('AgregarIntegrantePage', () => {
  let component: AgregarIntegrantePage;
  let fixture: ComponentFixture<AgregarIntegrantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarIntegrantePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarIntegrantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
