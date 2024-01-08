import { Injectable } from '@angular/core';
import { SentrySubFolder } from '../model/sentry-sub-folder';

@Injectable({
  providedIn: 'root'
})
export class SentryClipsService {

  sentryClipsContent: SentrySubFolder[] = [];

  constructor() { }
}
