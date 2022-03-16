import { Command } from 'commander';
import { DecisionStore } from './decision-store.js';
import { version } from './version.js';

const program = new Command();
program
  .name('baldrick-decision')
  .description('CLI to make cunning decisions')
  .version(version)
  .argument('<dir>', 'directory containing the decision files');

/**
 * This function may be merged in the future when the linter does a better job at recognizing .mts files
 */
export async function runClient() {
  try {
    program.parse();
    const rootDir = program.args[0] || './temp/';
    const decisionStore = new DecisionStore();
    decisionStore.loadFromDirectory(rootDir);

    console.log('-'.repeat(30));
    console.log('todo');
    console.log('-'.repeat(30));
    console.log(`✓ Done. Version ${version}`);
  } catch (error) {
    console.log('baldrick-decision will exit with error code 1');
    console.error(error);
    process.exit(1); // eslint-disable-line  unicorn/no-process-exit
  }
}
