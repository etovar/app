import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAsistentePage } from './agregar-asistente.page';

describe('AgregarAsistentePage', () => {
  let component: AgregarAsistentePage;
  let fixture: ComponentFixture<AgregarAsistentePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAsistentePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAsistentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
