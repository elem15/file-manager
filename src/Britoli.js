import path from 'path';
import fs from 'fs';
import { BrotliCompress, BrotliDecompress } from 'zlib';
import { pipeline } from 'stream';

export default class {
  constructor() {
    this.currentPath;
    this.pathToSrc;
    this.pathToDestination;
  }
  setPath(currentPath) {
    this.currentPath = currentPath;
  }
  setPathsToFiles(src, destination) {
    try {
      if (!path.isAbsolute(src)) {
        this.pathToSrc = path.join(this.currentPath, src);
      } else {
        this.pathToSrc = src;
      }
      if (!path.isAbsolute(destination)) {
        this.pathToDestination = path.join(this.currentPath, destination);
      } else {
        this.pathToDestination = destination;
      }
    } catch {
      console.log('Operation failed');
    }
  }
  archive(src, destination, archiveProcess) {
    this.setPathsToFiles(src, destination);
    try {
      const britoliCompressStream = archiveProcess();
      const srcStream = fs.createReadStream(this.pathToSrc);
      const destinationStream = fs.createWriteStream(this.pathToDestination);
      pipeline(
        srcStream,
        britoliCompressStream,
        destinationStream,
        (err) => {
          if (err) {
            console.log('Operation failed');
          }
        }
      )
    } catch {
      console.log('Operation failed');
    }
  }
  compress(src, destination) {
    if (src && destination) {
      this.archive(src, destination, BrotliCompress);
    } else {
      console.log('Operation failed');
    }
  }
  decompress(src, destination) {
    if (src && destination) {
      this.archive(src, destination, BrotliDecompress);
    } else {
      console.log('Operation failed');
    }
  }
}