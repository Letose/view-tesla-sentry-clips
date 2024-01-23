import { Component, OnInit } from '@angular/core';
import { SentrySubFolder } from '../model/sentry-sub-folder';
import { SentryClipsService } from '../service/sentry-clips.service';
import { ArrayUtilService } from '../utils/array-util.service';
import { DateUtilService } from '../utils/date-util.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StringUtilService } from '../utils/string-util.service';

@Component({
  selector: 'app-sentry-clips',
  templateUrl: './sentry-clips.component.html',
  styleUrls: ['./sentry-clips.component.css']
})
export class SentryClipsComponent implements OnInit {

  VIDEO_MP4 = "video/mp4";
  EVENT_FILE = "event.json";
  sentryClipsContent: SentrySubFolder[];
  positions = ["front", "back", "left", "right"];
  sentryClipsVideo: string[] = new Array(this.positions.length);
  sentryClipsType: string[] = new Array(this.positions.length);
  objectUrlArray: string[] = [];

  // Playback rates
  playbackRates = [1, 2, 4];
  playbackIndex = 0;

  // Used for view rendering
  displayPlay = true;
  pageIndex = 0;
  currentTimestamp = "";

  constructor(
    private sentryClipsService: SentryClipsService,
    private arrayUtil: ArrayUtilService,
    private dateUtil: DateUtilService,
    private stringUtil: StringUtilService,
    private router: Router,
  ) {
    this.sentryClipsContent = this.sentryClipsService.sentryClipsContent;
  }

  /**
   * Initializes the first videos displayed on the page after clicking 
   * the 'Next' button
   */
  ngOnInit(): void {
    // Sort SentryFolder's subfolders according to their names
    this.sentryClipsContent = this.arrayUtil.sortFiles(this.sentryClipsContent);
    this.processSentryClips(this.pageIndex);
  }

  private processSentryClips(index: number) {
    this.chooseClipsAccordingToEvent(index)
      .then(sentryClips => this.displaySentryClips(sentryClips))
      .catch(error => console.error(`Something went wrong: ${error}`));
  }

  /**
   * Checks the event.json file to find the videos that correspond to 
   * the moment when the event occurs.
   */
  private async chooseClipsAccordingToEvent(index: number): Promise<File[]> {
    // Retrieves event.json file
    const eventFile = this.sentryClipsContent[index].files.find(
      ({ name }) => name === this.EVENT_FILE);

    if (eventFile) {
      // Converts event.json content into an object
      const event = JSON.parse(await eventFile.text());

      if (event) {
        const eventTimestampParsed = this.dateUtil.parseTimestamp(event.timestamp);

        // Retrieves the files within the same folder than event.json
        const sentryClips = this.sentryClipsContent[index].files.filter(
          ({ type }) => type === this.VIDEO_MP4);
        
        // Map with custom value to store timestamp as both a string and a number
        const sentryClipsTimestampMap = this.fillSentryClipsTimestampMap(eventTimestampParsed, sentryClips);

        // Gets the max timestamp
        const timestampMax = [...sentryClipsTimestampMap.keys()].reduce((a, b) => Math.max(a, b), -Infinity);

        const sentryClipsMax = sentryClipsTimestampMap.get(timestampMax);
        if (sentryClipsMax && !this.stringUtil.isEmpty(sentryClipsMax.fileName)) {
          this.currentTimestamp = this.dateUtil.parseFrontendTimestamp(sentryClipsMax.fileName);
          return sentryClipsMax.files;
        }
      }
    }

    return [];
  }

  private fillSentryClipsTimestampMap(eventTimestampParsed: number, sentryClips: File[]): Map<number, { fileName: string, files: File[] }> {
    // Map with custom value to store timestamp as both a string and a number
    const eventFilesMap = new Map<number, { fileName: string, files: File[] }>();
    // Regex to remove the last part of file names
    const regex = /-[^-]*$/g;

    // For each files, convert the timestamp into a number and push it into eventFilesMap
    for (const sentryClip of sentryClips) {
      const fileName = sentryClip.name.replace(regex, '');
      const fileTimestamp = this.dateUtil.parseTimestamp(fileName);
      let eventFilesTmp = eventFilesMap.get(fileTimestamp);

      if (fileTimestamp <= eventTimestampParsed) {
        if (eventFilesTmp && eventFilesTmp.files.length > 0) {
          eventFilesTmp.files.push(sentryClip);
        } else {
          eventFilesTmp = { fileName: fileName, files: new Array(sentryClip) };
        }

        eventFilesMap.set(fileTimestamp, eventFilesTmp );
      }
    }

    return eventFilesMap;
  } 

  private displaySentryClips(sentryClips: File[]) {
    for (let i = 0; i < this.positions.length; i++) {
      const position = this.positions[i];
      const file = sentryClips.find(({ name }) => name.includes(position));

      if (file) {
        const objectUrl = URL.createObjectURL(file);
        this.objectUrlArray.push(objectUrl);
        this.sentryClipsVideo[i] = objectUrl;
        this.sentryClipsType[i] = file.type;
      }
    }
  }

  private clearObjectUrlArray() {
    while (this.objectUrlArray.length > 0) {
      const objectUrl = this.objectUrlArray.pop();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  }

  private cleaning() {
    this.clearObjectUrlArray();
    this.sentryClipsVideo = [];
    this.sentryClipsType = [];
    this.displayPlay = true;
    this.playbackIndex = 0;
  }

  // --------------------------Button actions--------------------------

  onClickHome() {
    this.router.navigate(['/home']);
  }

  onClickPlayPause() {
    const videoItems = document.querySelectorAll("video");
    
    videoItems.forEach(async video => {
      this.displayPlay ? await video.play() : video.pause();
    });

    this.displayPlay = !this.displayPlay;
  }

  onClickPrevious() {
    this.cleaning();
    this.processSentryClips(--this.pageIndex);
  }

  onClickNext() {
    this.cleaning();
    this.processSentryClips(++this.pageIndex);
  }

  onClickSpeedUp() {
    const videoItems = document.querySelectorAll("video");
    this.playbackIndex = ++this.playbackIndex % this.playbackRates.length;
    
    videoItems.forEach(video => {
       video.playbackRate = this.playbackRates[this.playbackIndex];
    });
  }
}
