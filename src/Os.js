import os from 'os';
import { join } from 'path';

export default class {
  EOL() {
    console.log(JSON.stringify(os.EOL));
  }
  cpus() {
    const cpusInfo = os.cpus();
    console.log(`You host machine has ${cpusInfo.length} processors: \n`);
    cpusInfo.map((item, idx) => Object.entries(item).map(([key, value]) => {
      if (key === 'model') {
        console.log(`${idx + 1}. CPU model: ${value}`);
      }
      if (key === 'speed') {
        console.log(`   Current CPU speed: ${value}MHz`);
      }
    })
    )
  }
  homedir() {
    console.log(os.homedir());
  }
  username() {
    console.log(os.userInfo().username);
  }
  architecture() {
    console.log(os.arch());
  }
}
