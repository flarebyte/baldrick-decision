import { version } from './version.js';

/**
 * This function may be merged in the future when the linter does a better job at recognizing .mts files
 */
export async function runClient() {
  try {
   
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