import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SentrySubFolder } from '../model/sentry-sub-folder';
import { SentryClipsService } from '../service/sentry-clips.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  SENTRY_CLIPS_FOLDER = "SentryClips";
  files: File[] = [];
  sentryClipsContent: Map<String, File[]> = new Map();
  isRight = false;

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private sentryClipsService: SentryClipsService,
  ) {}

  onLoad(event: any) {
    this.files = event.target.files;
    // Check that we've been given the right folder
    this.isRight = this.checkSentryClipsFolder(event.target.files[0]);
  }

  onClick() {
    this.processFiles(this.files);
    const sentrySubFolders: SentrySubFolder[] = this.toSentrySubFolders(this.sentryClipsContent);
    this.sentryClipsService.sentryClipsContent = sentrySubFolders;
    this.router.navigate(['/sentry-clips']);
  }

  private checkSentryClipsFolder(file: File): boolean {
    if (!file || !file.webkitRelativePath) {
      return false;
    }

    const filePath = file.webkitRelativePath.split('/');
    /**
     * If the files don't come from SentryCLips, then returns an error
     * and displays a message on the screen
     */
    if (!filePath || filePath.length == 0 || filePath[0] !== this.SENTRY_CLIPS_FOLDER) {
      const errorMessage = `Please give the path of ${this.SENTRY_CLIPS_FOLDER} folder`;
      console.error(errorMessage);
      this._snackBar.open(errorMessage, '', {
        duration: 10_000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return false;
    }

    return true;
  }

  private processFiles(files: File[]) {
    // For each file from the given folder
    for (const file of files) {
      this.processFile(file);
    }
  }

  private processFile(file: File) {
    const filePath = file.webkitRelativePath.split('/');

    // Add a file to the array matching the timestamp, then set it in the map
    const sentryClipsSubFolder = filePath[1];
    if (sentryClipsSubFolder && sentryClipsSubFolder !== "") {
      let filesTmp = this.sentryClipsContent.get(filePath[1])!;

      // If this is not the first file added, then get the content and push the current file within
      if (filesTmp && filesTmp.length > 0) {
        filesTmp.push(file);
      } else {  // Else, add the current file
        filesTmp = new Array(file);
      }

      this.sentryClipsContent.set(sentryClipsSubFolder, filesTmp);
    }
  }

  /**
   * Casts a map into an array of SentrySubFolder objects.
   * @param map the map
   * @returns an array of SentrySubFolder objects.
   */
  private toSentrySubFolders(map: Map<String, File[]>): SentrySubFolder[] {
    let sentrySubFolders: SentrySubFolder[] = [];
    for (const key of map.keys()) {
      const sentrySubFolder = this.toSentrySubFolder(key as string, map.get(key));
      if (sentrySubFolder) {
        sentrySubFolders.push(sentrySubFolder);
      }
    }

    return sentrySubFolders;
  }

  /**
   * Casts the parameters into a SentrySubFolder object.
   * @param key the key
   * @param value the sentry files
   * @returns a SentrySubFolder object.
   */
  private toSentrySubFolder(key: string, value?: File[]): SentrySubFolder | null {
    let sentrySubFolder = null;

    if (value) {
      sentrySubFolder = new SentrySubFolder(key, value);
    }

    return sentrySubFolder;
  }
}
