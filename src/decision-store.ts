import YAML from 'yaml';
import * as jetpack from 'fs-jetpack';
import { MainDecision } from './decision';
import { createMainDecisionValidator } from './decision-schema';
import { PromptChoice } from './model';

export class DecisionStore {
  decisions: MainDecision[] = [];
  messages: string[] = [];
  validateDecision = createMainDecisionValidator();
  #load(mainDecision: MainDecision) {
    this.decisions.push(mainDecision);
  }

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

  async loadFromDirectory(rootDir: string) {
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

  getChoices(): PromptChoice[] {
    return this.decisions.map((decision) => ({
      title: decision.title,
      description: decision.description,
      value: decision.title,
    }));
  }

  getByTitle(title: string): MainDecision | false {
    return this.decisions.find((decision) => decision.title === title) || false;
  }
}
