import path, { sep } from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { stat } from 'fs/promises';

export default class Files {
  constructor() {
    this.pathToDir = null;
  }
  setPath(currentPath) {
    this.pathToDir = currentPath;
  }
  async cat(fileName) {
    const pathToFile = path.join(this.pathToDir, fileName);
    try {
      const stats = await stat(pathToFile);
      if (stats.isFile()) {
        const stream = fs.createReadStream(pathToFile);
        stream.pipe(process.stdout);
        stream.on('end', () => process.stdout.write('\n'));
      } else {
        throw new Error();
      }
    } catch {
      console.log('Operation failed');
    }
  }
  async add(fileName) {
    const pathToFile = path.join(this.pathToDir, fileName);
    console.log(pathToFile)
    try {
      await stat(pathToFile);
      console.log('Operation failed');
    } catch {
      try {
        const stream = fs.createWriteStream(pathToFile);
        stream.write('');
      } catch {
        console.log('Operation failed');
      }
    }
  }
  async rn(pathToFile, newFilename) {
    let src;
    let destination;
    if (!path.isAbsolute(pathToFile)) {
      src = path.join(this.pathToDir, pathToFile);
      destination = path.join(this.pathToDir, newFilename);
    } else {
      const pathToDir = pathToFile.split(path.sep);
      pathToDir.pop();
      src = pathToFile;
      destination = path.join(path.sep, ...pathToDir, newFilename);
    }
    try {
      await fsp.rename(src, destination);
    } catch {
      console.log('Operation failed');
    }
  }
  async cp(pathToFile, newPathToDir) {
    let src;
    let fileName;
    let destination;
    let destinationDir;

    if (!path.isAbsolute(pathToFile)) {
      src = path.join(this.pathToDir, pathToFile);
      fileName = pathToFile;
    } else {
      const pathToDir = pathToFile.split(path.sep);
      fileName = pathToDir.pop();
      src = pathToFile;
    }
    if (!path.isAbsolute(newPathToDir)) {
      destination = path.join(this.pathToDir, newPathToDir, fileName);
      destinationDir = path.join(this.pathToDir, newPathToDir);
    } else {   
      destination = path.join(newPathToDir, fileName);
      destinationDir = newPathToDir;
    }    
    console.log(destinationDir)
    try {
      await fsp.mkdir(destinationDir, { recursive: true });
      await fsp.copyFile(src, destination);
    } catch {
      console.log('Operation failed');
    }
  }
}
