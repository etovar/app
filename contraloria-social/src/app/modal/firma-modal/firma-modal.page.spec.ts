import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaModalPage } from './firma-modal.page';

describe('FirmaModalPage', () => {
  let component: FirmaModalPage;
  let fixture: ComponentFixture<FirmaModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmaModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
