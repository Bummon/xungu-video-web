export namespace common {
  export interface File {
    fileName: string;
    fileSize: number | bigint;
    newFileName: string;
    url: string;
    originalFilename: string;
    fileLength: string;
  }

  export interface Files {
    fileNames: string;
    fileSize: string;
    newFileNames: string;
    urls: string;
    originalFilenames: string;
    fileLength: string;
  }
}
