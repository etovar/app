import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComitesEstatusPage } from './comites-estatus.page';

describe('ComitesEstatusPage', () => {
  let component: ComitesEstatusPage;
  let fixture: ComponentFixture<ComitesEstatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComitesEstatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComitesEstatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
