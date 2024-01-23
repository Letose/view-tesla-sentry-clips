import { Injectable } from '@angular/core';
import { SentrySubFolder } from '../model/sentry-sub-folder';

@Injectable({
  providedIn: 'root'
})
export class DateUtilService {

  constructor() { }

  /**
   * Parses a sentry file timestamp from YYYY-MM-DD_HH-MI-SS to YYYY-MM-DDTHH:MI:SS.
   * @param timestamp the sentry file's timestamp to parse
   * @returns the number of milliseconds between that date and midnight, January 1, 1970.
   */
  parseTimestamp(timestamp: string): number {
    const timestampParsed = this.parseTimestampToString(timestamp);
    
    return Date.parse(timestampParsed);    
  }

  parseTimestampToString(timestamp: string): string {
    // Regex for all dashes after 'T'
    const regex = /(?<=T.*)-/g;
    return timestamp
      .replace('_', 'T')
      .replace(regex, ':');
  }

  parseFrontendTimestamp(timestamp: string): string {
    // Regex for all dashes after '_'
    const regex = /(?<=_.*)-/g;
    return timestamp
      .replace(regex, ':')
      .replace('_', ' ');
  }
}
