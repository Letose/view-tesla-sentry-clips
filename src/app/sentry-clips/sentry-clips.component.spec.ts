import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentryClipsComponent } from './sentry-clips.component';

describe('SentryClipsComponent', () => {
  let component: SentryClipsComponent;
  let fixture: ComponentFixture<SentryClipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentryClipsComponent]
    });
    fixture = TestBed.createComponent(SentryClipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
