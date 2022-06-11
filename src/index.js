import { argv } from 'process';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'process';
import path from 'path';
import os from 'os';
import fsp from 'fs/promises';

const home = os.homedir();

let userName;
try {
  userName = argv[2].split('=')[1];
} catch {
  console.log('To get correct user name, please exit and try again. \n', 
    'Type "npm run start --- --username=your_username" (3! ---) \n',
    'or "node ./src/index.js -- --username=your_username"')
  userName = 'user_name'
}

import Navigator from './Navigator.js'
import Files from './Files.js';
import filesCommandHelper from './filesCommandHelper.js';
import Os from './Os.js';
import Hash from './Hash.js';

const navigator = new Navigator(home);
const files = new Files();
const osInfo = new Os();
const hash = new Hash();

const rl = readline.createInterface({ input, output });

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
  else if (input.startsWith('mv ')) {
    const fileNames = filesCommandHelper(input, navigator, files);
    files.mv(...fileNames);
  }
  else if (input.startsWith('rm ')) {
    const fileNames = filesCommandHelper(input, navigator, files);
    files.rm(...fileNames);
  }
  else if (input.startsWith('os ')) {
    try {
      const commandsArr = input.split(' ');
      const commandName = commandsArr.filter(item => item.startsWith('--'))[0].slice(2);
      osInfo[commandName]();
    } catch {
      console.log('Invalid input');
    }
  }
  else if (input.startsWith('hash ')) {
    const commandArr = input.split(' ');
    const fileName = commandArr[commandArr.length - 1];
    const currentPath = navigator.get();
    hash.printHash(fileName, currentPath);
  }
  else {
    console.log('Invalid input');
  }
});

rl.on('close', () => console.log(`Thank you for using File Manager, ${userName}!`));