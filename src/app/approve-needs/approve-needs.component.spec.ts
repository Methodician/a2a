/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApproveNeedsComponent } from './approve-needs.component';

describe('ApproveNeedsComponent', () => {
  let component: ApproveNeedsComponent;
  let fixture: ComponentFixture<ApproveNeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveNeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
