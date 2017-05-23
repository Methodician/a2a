import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightDetailComponent } from './spotlight-detail.component';

describe('SpotlightDetailComponent', () => {
  let component: SpotlightDetailComponent;
  let fixture: ComponentFixture<SpotlightDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotlightDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlightDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
