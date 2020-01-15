import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaModalPage } from './ficha-modal.page';

describe('FichaModalPage', () => {
  let component: FichaModalPage;
  let fixture: ComponentFixture<FichaModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
