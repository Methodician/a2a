import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSpotlightComponent } from './post-spotlight.component';

describe('PostSpotlightComponent', () => {
  let component: PostSpotlightComponent;
  let fixture: ComponentFixture<PostSpotlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostSpotlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSpotlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
