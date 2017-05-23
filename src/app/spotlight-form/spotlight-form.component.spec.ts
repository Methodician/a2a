import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightFormComponent } from './spotlight-form.component';

describe('SpotlightFormComponent', () => {
  let component: SpotlightFormComponent;
  let fixture: ComponentFixture<SpotlightFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotlightFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlightFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
