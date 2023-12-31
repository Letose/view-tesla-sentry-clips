import { Component } from '@angular/core';
import { SentrySubFolder } from '../model/sentry-sub-folder';

@Component({
  selector: 'app-sentry-clips',
  templateUrl: './sentry-clips.component.html',
  styleUrls: ['./sentry-clips.component.css']
})
export class SentryClipsComponent {

  LOCAL_STORAGE_KEY = "sentryClipsContent";
  sentryClipsContent: SentrySubFolder[];

  constructor() {
    this.sentryClipsContent = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY)!);
  }
}
