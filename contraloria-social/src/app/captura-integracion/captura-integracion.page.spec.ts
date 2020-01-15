import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturaIntegracionPage } from './captura-integracion.page';

describe('CapturaIntegracionPage', () => {
  let component: CapturaIntegracionPage;
  let fixture: ComponentFixture<CapturaIntegracionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapturaIntegracionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturaIntegracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
