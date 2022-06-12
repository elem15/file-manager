import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { stat } from 'fs/promises';
import { pipeline } from 'stream';

export default class Files {
  constructor() {
    this.pathToDir = '';
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
  async rn(pathToFile = '', newFilename = '', errMessage = 'Operation failed') {
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
      await fsp.access(destination);
      throw new Error('File exist')
    } catch (err) {
      if (err.message !== 'File exist') {
        try {
          await fsp.access(src);
          const srcStream = fs.createReadStream(src);
          const destinationStream = fs.createWriteStream(destination);
          pipeline(
            srcStream,
            destinationStream,
            (err) => {
              if (err) {
                console.log(errMessage);
              }
            }
          )
          srcStream.on('end', async () => fs.rm(src, err => {
            if (err) console.log(errMessage);
          }));
        } catch {
          console.log(errMessage);
        }
      } else {
        console.log(errMessage);
      }
    }
  }

  async rm(pathToFile) {
    let src;
    if (!path.isAbsolute(pathToFile)) {
      src = path.join(this.pathToDir, pathToFile);
    } else {
      src = pathToFile;
    }
    try {
      const stats = await stat(src);
      if (stats.isFile()) {
        await fsp.rm(src);
        console.log(`File ${src} was removed`)
      } else {
        throw new Error();
      }
    } catch {
      console.log('Operation failed');
    }
  }
  async cp(pathToFile, newPathToDir, errMessage = 'Operation failed') {
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
    try {
      await fsp.mkdir(destinationDir, { recursive: true });
      try {
        await fsp.access(destination);
        throw new Error('File exist')
      } catch (err) {
        if (err.message !== 'File exist') {
          try {
            await fsp.access(src);
            const srcStream = fs.createReadStream(src);
            const destinationStream = fs.createWriteStream(destination);
            pipeline(
              srcStream,
              destinationStream,
              (err) => {
                if (err) {
                  console.log(errMessage);
                  return '';
                }
              }
            )
          } catch {
            console.log(errMessage);
            return '';
          }
        } else {
          console.log(errMessage);
          return '';
        }
      }
    } catch {
      console.log(errMessage);
      return '';
    }
    return src;
  }
  async mv(pathToFile, newPathToDir) {  
      const src = await this.cp(pathToFile, newPathToDir, '');
      fs.rm(src, err => {
        if (err) console.log('Operation failed');
      });  
  }
}
