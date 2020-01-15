import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsComitePage } from './docs-comite.page';

describe('DocsComitePage', () => {
  let component: DocsComitePage;
  let fixture: ComponentFixture<DocsComitePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsComitePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsComitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
