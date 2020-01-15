import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarParticipantePage } from './agregar-participante.page';

describe('AgregarParticipantePage', () => {
  let component: AgregarParticipantePage;
  let fixture: ComponentFixture<AgregarParticipantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarParticipantePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarParticipantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
