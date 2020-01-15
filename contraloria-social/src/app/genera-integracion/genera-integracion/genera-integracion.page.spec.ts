import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneraIntegracionPage } from './genera-integracion.page';

describe('GeneraIntegracionPage', () => {
  let component: GeneraIntegracionPage;
  let fixture: ComponentFixture<GeneraIntegracionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneraIntegracionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneraIntegracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
