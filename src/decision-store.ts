import YAML from 'yaml';
import Ajv from 'ajv';
import { MainDecision } from './decision';
import { decisionSchema } from './decision-schema';

interface PromptChoice {
  title: string;
  description: string;
  value: string;
}

const createValidator = () => {
  const ajv = new Ajv();
  return ajv.compile<MainDecision>(decisionSchema);
};

export class DecisionStore {
  decisions: MainDecision[] = [];
  messages: string[] = [];
  validateDecision = createValidator();
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
    } catch (exception) {
      this.messages.push(`Could not parse YAML file: ${filename}`);
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
