import { argv } from 'process';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'process';
import path from 'path';
import os from 'os';
import fsp from 'fs/promises';

import Navigator from './Navigator.js'

const rl = readline.createInterface({ input, output });

const userName = argv[2].split('=')[1];

const home = os.homedir();

const navigator = new Navigator(home);

console.log(`Welcome to the File Manager, ${userName}!`)
rl.on('line', (input) => {
  input = input.trim()
  if(input === '.exit') {    
    rl.close();
  }
  if(input === 'ls') {    
    navigator.ls();
  }
  if(input === 'up') {    
    navigator.up();
  }
  if(input.startsWith('cd ')) { 
    const newPath = input.split(' ')[1];
    navigator.cd(newPath);
  }

});

rl.on('close', () => console.log(`Thank you for using File Manager, ${userName}!`));