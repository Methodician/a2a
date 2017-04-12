import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFinancialsComponent } from './review-financials.component';

describe('ReviewFinancialsComponent', () => {
  let component: ReviewFinancialsComponent;
  let fixture: ComponentFixture<ReviewFinancialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewFinancialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
