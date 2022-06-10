import path from 'path';
import fsp from 'fs/promises';
import { stat } from 'fs/promises'

export default class {
  constructor(homePath) {
    this.path = homePath;
    this.homePath = homePath;
  }
  async ls() {
    const filesList = await fsp.readdir(this.path);
    filesList.map((file) => console.log(file));
  }
  async up() {
    if(this.path !== this.homePath) {
      const currentPath = this.path.split(path.sep);
      currentPath.pop();
      this.path = path.join(path.sep, ...currentPath);
    }
    console.log(`Your current path is ${this.path}`);
  }
  async cd(newPath) {
    if (!path.isAbsolute(newPath)) {
      newPath = path.join(this.path, newPath);
    }
    try {
      const stats = await stat(newPath);
      if (!stats) {
        throw new Error();
      }
      else if (stats.isDirectory()) {
        this.path = newPath;
        console.log(`Your current path is ${this.path}`);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.log('Operation failed');
    }
  }
  get() {
    return this.path;
  }
}