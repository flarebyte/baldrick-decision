import { TagManager } from './tag';

interface PromptChoice {
  title: string;
  description: string;
  value: string;
}

interface PromptText {
  name: string;
  message: string;
}

interface Question {
  title: string;
  description: string;
  trigger: string;
  tags: string;
}

interface Parameter {
  trigger: string;
  name: string;
  description: string;
}

interface Template {
  trigger: string;
  value: string;
}

interface DecisionRoute {
  title: string;
  description: string;
  questions: Question[];
  parameters: Parameter[];
  templates: Template[];
}

interface ParameterValue {
  name: string;
  value: string;
}
interface DecisionTaken {
  parameters: ParameterValue[];
  template: string;
}

const noDecisionTaken: DecisionTaken = {
  parameters: [],
  template: '',
};

export interface MainDecision extends DecisionRoute {
  fragment: DecisionRoute;
}

export class DecisionStore {
  decisions: MainDecision[] = [];
  load(mainDecision: MainDecision) {
    this.decisions.push(mainDecision);
  }
  toChoices(): PromptChoice[] {
    return this.decisions.map((decision) => ({
      title: decision.title,
      description: decision.description,
      value: decision.title,
    }));
  }
  getByChoiceValue(value: string): MainDecision | false {
    return this.decisions.find((decision) => decision.title === value) || false;
  }
}

export class DecisionManager {
  tagManager = new TagManager();
  mainDecision: MainDecision;
  mainDecisionTaken: DecisionTaken = noDecisionTaken;

  constructor(mainDecision: MainDecision) {
    this.mainDecision = mainDecision;
  }

  #findQuestionsByTrigger(trigger: string): Question[] {
    return this.mainDecision.questions.filter(
      (question) => question.trigger === trigger
    );
  }

  getMainQuestionsByTag(tag: string): PromptChoice[] {
    const questions = this.#findQuestionsByTrigger(tag);
    const choices: PromptChoice[] = questions.map((question) => ({
      title: question.title,
      description: question.description,
      value: question.tags,
    }));
    return choices;
  }

  getRootMainQuestions(): PromptChoice[] {
    return this.getMainQuestionsByTag('');
  }
  getFollowUpMainQuestions(): PromptChoice[] {
    const openTags = this.tagManager.open();
    if (openTags.length === 0) {
      return [];
    }
    let choices: PromptChoice[] = [];
    for (const tag of openTags) {
      const questions = this.getMainQuestionsByTag(tag);
      choices = choices.concat(questions);
      this.tagManager.deleteOpen(tag);
    }
    return choices;
  }
  pushAnswerTags(tags: string) {
    this.tagManager.push(tags.split(' '));
  }
  pushAutoAnswerTags() {
    const autoTags = this.mainDecision.questions
      .filter((question) => question.trigger === 'auto')
      .map((question) => question.tags);
    for (const tag of autoTags) {
      this.pushAnswerTags(tag);
    }
  }
  getMainParameters(): PromptText[] {
    const params = this.mainDecision.parameters.filter((parameter) =>
      this.tagManager.matchTrigger(parameter.trigger)
    );
    const texts: PromptText[] = params.map((param) => ({
      name: param.name,
      message: param.description,
    }));
    return texts;
  }
  getMainTemplate(): Template | false {
    const templates = this.mainDecision.templates.filter((parameter) =>
      this.tagManager.matchTrigger(parameter.trigger)
    );
    const template = templates[0];
    return template ? template : false;
  }
  setMainDecisionTaken(parameters: ParameterValue[]) {
    const mainTemplate = this.getMainTemplate();
    const template = mainTemplate ? mainTemplate.value : 'no-template-found';
    const decisionTaken: DecisionTaken = { parameters, template };
    this.mainDecisionTaken = decisionTaken;
  }
  getMainDecisionTaken(): DecisionTaken {
    return this.mainDecisionTaken;
  }
}
