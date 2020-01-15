import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComitesPage } from './comites.page';

describe('ComitesPage', () => {
  let component: ComitesPage;
  let fixture: ComponentFixture<ComitesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComitesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComitesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
