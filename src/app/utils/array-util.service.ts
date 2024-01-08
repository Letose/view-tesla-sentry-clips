import { Injectable } from '@angular/core';
import { DateUtilService } from './date-util.service';
import { SentrySubFolder } from '../model/sentry-sub-folder';

@Injectable({
  providedIn: 'root'
})
export class ArrayUtilService {

  constructor(
    private dateUtil: DateUtilService
  ) { }

  /**
   * Format sentrySubFolders timestamps into Date objects and compare them.
   * @param sentrySubFolders the array to be sorted
   * @returns the array sorted.
   */
  sortFiles(sentrySubFolders: SentrySubFolder[]): SentrySubFolder[] {
    return sentrySubFolders.sort((a, b) => {
      const timestampA = this.dateUtil.parseTimestamp(a.timestamp);
      const timestampB = this.dateUtil.parseTimestamp(b.timestamp);

      if (timestampA && timestampB) {
        return timestampA - timestampB;
      }

      return 0;
    });
  }
}
