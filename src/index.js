import { argv } from 'process';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

const userName = argv[2].split('=')[1];

console.log(`Welcome to the File Manager, ${userName}!`)
rl.on('line', (input) => {
  if(input.trim() === '.exit') {
    rl.close();
  }
});