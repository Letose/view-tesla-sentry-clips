export class SentryFile {
    lastModified: number;
    name: string;
    webkitRelativePath: string;
    type: string;

    constructor(file: File) {
        this.lastModified = file.lastModified;
        this.name = file.name;
        this.webkitRelativePath = file.webkitRelativePath;
        this.type = file.type;
    }
}
