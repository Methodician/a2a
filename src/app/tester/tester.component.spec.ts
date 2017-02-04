/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TesterComponent } from './tester.component';

describe('TesterComponent', () => {
  let component: TesterComponent;
  let fixture: ComponentFixture<TesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
