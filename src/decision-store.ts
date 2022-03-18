import YAML from 'yaml';
import jetpack from 'fs-jetpack';
import { MainDecision } from './decision.js';
import { createMainDecisionValidator } from './decision-schema.js';
import { PromptChoice } from './model.js';

/**
 * A decision store will usually store all the decision files in a given repository
 */
export class DecisionStore {
  decisions: MainDecision[] = [];
  messages: string[] = [];
  validateDecision = createMainDecisionValidator();
  #load(mainDecision: MainDecision) {
    this.decisions.push(mainDecision);
  }
  /**
   * Load the content of the decision file
   * @param filename the filename for information purposes. No IO will be performed
   * @param content the YAML content of the decision file as a string
   */
  loadFromString(filename: string, content: string) {
    try {
      const unsafeDecision = YAML.parse(content);
      const validation = this.validateDecision(unsafeDecision);
      if (validation) {
        this.#load(unsafeDecision);
      } else {
        this.messages.push(`Invalid schema for YAML file: ${filename}`);
      }
    } catch {
      this.messages.push(`Could not parse YAML file: ${filename}`);
    }
  }

  /**
   * Loads all the YAML decision files from a directory.
   * Note: This does not recurse over sub-folders.
   * @param rootDir the directory containing the decision files
   */
  async loadFromDirectory(rootDir: string) {
    // eslint-disable-next-line  unicorn/no-array-method-this-argument
    const filenames = jetpack.find(rootDir, { matching: '*.decision.yaml' });
    const readPromises = filenames.map((filename) =>
      jetpack.readAsync(filename)
    );
    const contents = await Promise.all(readPromises);

    for (const [idx, filename] of filenames.entries()) {
      const content = contents[idx];
      if (content) {
        this.loadFromString(filename, content);
      } else {
        throw new Error(`The file ${filename} cannot be read!`);
      }
    }
  }

  /**
   * List of the possible decision files as an array of choices
   */
  getChoices(): PromptChoice[] {
    return this.decisions.map((decision) => ({
      title: decision.title,
      description: decision.description,
      value: decision.title,
    }));
  }

  /**
   * Find a decision document by title
   * @param title the title of the decision file
   */
  getByTitle(title: string): MainDecision | false {
    return this.decisions.find((decision) => decision.title === title) || false;
  }
}
