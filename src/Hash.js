import path from 'path';
import fs from 'fs';
import { stdout } from 'process';
import { createHash } from 'crypto';

export default class {
  constructor() {
    this.path;
  }
  async printHash(fileName, currentPath) {
    const hash = createHash('sha256');
    hash.setEncoding('hex');   
    this.path = currentPath;
    let pathToFile;
    try {
      if (!path.isAbsolute(fileName)) {
        pathToFile = path.join(this.path, fileName);
      } else {
        pathToFile = fileName;
      }
      const stream = fs.createReadStream(pathToFile);     
      stream
        .on('error', () => console.log('Operation failed'))
        .pipe(hash)
        .on('error', () => console.log('Operation failed'))
        .pipe(stdout)
        .on('error', () => console.log('Operation failed'));
      stream.on('end', () => process.stdout.write('\n'));
    } catch {
      console.log('Operation failed');
    }
  }
}