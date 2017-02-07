/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NeedComponent } from './need.component';

describe('NeedComponent', () => {
  let component: NeedComponent;
  let fixture: ComponentFixture<NeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
