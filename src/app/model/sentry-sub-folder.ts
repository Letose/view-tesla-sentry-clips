import { SentryFile } from "./sentry-file";

export class SentrySubFolder {

    timestamp: string;
    sentryFiles: SentryFile[];

    constructor(timestamp: string, sentryFiles: SentryFile[]) {
        this.timestamp = timestamp;
        this.sentryFiles = sentryFiles;
    }
}
