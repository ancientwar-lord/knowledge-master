import {Command} from 'commander';

const program = new Command();
program
  .name('scan')
  .description('Scan the latest commit and analyze knowledge')
  .action(() =>{
    console.log('Scanning the latest commit and analyzing knowledge...');
  });

program.parse(process.argv);  