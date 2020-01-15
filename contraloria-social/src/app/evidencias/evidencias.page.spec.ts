import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciasPage } from './evidencias.page';

describe('EvidenciasPage', () => {
  let component: EvidenciasPage;
  let fixture: ComponentFixture<EvidenciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidenciasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
