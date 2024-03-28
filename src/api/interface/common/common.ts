export namespace common {
  export interface File {
    fileName: string;
    fileSize: number | bigint;
    newFileName: string;
    fileUrl: string;
    originalFilename: string;
    fileLength: string;
  }

  export interface Files {
    fileNames: string;
    fileSize: string;
    newFileNames: string;
    fileUrls: string;
    originalFilenames: string;
    fileLength: string;
  }
}
