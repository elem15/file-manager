import { argv } from 'process';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'process';
import path from 'path';
import os from 'os';
import fsp from 'fs/promises';

import Navigator from './Navigator.js'
import Files from './Files.js';
import filesCommandHelper from './filesCommandHelper.js';

const rl = readline.createInterface({ input, output });

const userName = argv[2].split('=')[1];

const home = os.homedir();

const navigator = new Navigator(home);
const files = new Files();

console.log(`Welcome to the File Manager, ${userName}!`)
rl.on('line', (input) => {
  input = input.trim()
  if (input === '.exit') {
    rl.close();
  }
  else if (input === 'ls') {
    navigator.ls();
  }
  else if (input === 'up') {
    navigator.up();
  }
  else if (input.startsWith('cd ')) {
    const commandArr = input.split(' ');
    const newPath = commandArr[commandArr.length - 1];
    navigator.cd(newPath);
  }
  else if (input.startsWith('cat ')) {
    const fileNames = filesCommandHelper(input, navigator, files);
    files.cat(...fileNames);
  }
  else if (input.startsWith('add ')) {
    const fileNames = filesCommandHelper(input, navigator, files);
    files.add(...fileNames);
  }
  else if (input.startsWith('rn ')) {
    const fileNames = filesCommandHelper(input, navigator, files);
    files.rn(...fileNames);
  }
  else if (input.startsWith('cp ')) {
    const fileNames = filesCommandHelper(input, navigator, files);
    files.cp(...fileNames);
  }
  else {
    console.log('Invalid input');
  }
});

rl.on('close', () => console.log(`Thank you for using File Manager, ${userName}!`));