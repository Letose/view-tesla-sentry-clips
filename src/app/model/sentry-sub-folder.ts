export class SentrySubFolder {

  timestamp: string;
  files: File[];

  constructor(timestamp: string, files: File[]) {
    this.timestamp = timestamp;
    this.files = files;
  }
}
