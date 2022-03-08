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
  mainDecision: MainDecision;
  tagManager = new TagManager();
  mainDecisionTaken: DecisionTaken = noDecisionTaken;
  fragmentDecisionTakenList: DecisionTaken[] = [];

  constructor(mainDecision: MainDecision) {
    this.mainDecision = mainDecision;
  }

  #resetTagManager() {
    this.tagManager = new TagManager();
  }
  #findScopeQuestionsByTrigger(decisionRoute: DecisionRoute, trigger: string): Question[] {
    return decisionRoute.questions.filter(
      (question) => question.trigger === trigger
    );
  }
  
  #getScopeQuestionsByTag(decisionRoute: DecisionRoute, tag: string): PromptChoice[] {
    const questions = this.#findScopeQuestionsByTrigger(decisionRoute, tag);
    const choices: PromptChoice[] = questions.map((question) => ({
      title: question.title,
      description: question.description,
      value: question.tags,
    }));
    return choices;
  }
  getMainQuestionsByTag(tag: string): PromptChoice[] {
    return this.#getScopeQuestionsByTag(this.mainDecision, tag);
  }

  getFragmentQuestionsByTag(tag: string): PromptChoice[] {
    return this.#getScopeQuestionsByTag(this.mainDecision.fragment, tag);
  }

  getRootMainQuestions(): PromptChoice[] {
    return this.getMainQuestionsByTag('');
  }

  getRootFragmentQuestions(): PromptChoice[] {
    return this.getFragmentQuestionsByTag('');
  }

  #getFollowUpScopeQuestions(decisionRoute: DecisionRoute): PromptChoice[] {
    const openTags = this.tagManager.open();
    if (openTags.length === 0) {
      return [];
    }
    let choices: PromptChoice[] = [];
    for (const tag of openTags) {
      const questions = this.#getScopeQuestionsByTag(decisionRoute, tag);
      choices = choices.concat(questions);
      this.tagManager.deleteOpen(tag);
    }
    return choices;
  }
  getFollowUpMainQuestions(): PromptChoice[] {
    return this.#getFollowUpScopeQuestions(this.mainDecision)
  }
  getFollowUpFragmentQuestions(): PromptChoice[] {
    return this.#getFollowUpScopeQuestions(this.mainDecision.fragment)
  }
  pushAnswerTags(tags: string) {
    this.tagManager.push(tags.split(' '));
  }

  #pushScopeAutoAnswerTags(decisionRoute: DecisionRoute) {
    const autoTags = decisionRoute.questions
      .filter((question) => question.trigger === 'auto')
      .map((question) => question.tags);
    for (const tag of autoTags) {
      this.pushAnswerTags(tag);
    }
  }
  pushMainAutoAnswerTags() {
    this.#pushScopeAutoAnswerTags(this.mainDecision)
  }
  pushFragmentAutoAnswerTags() {
    this.#pushScopeAutoAnswerTags(this.mainDecision.fragment)
  }
  #getScopeParameters(decisionRoute: DecisionRoute): PromptText[] {
    const params = decisionRoute.parameters.filter((parameter) =>
      this.tagManager.matchTrigger(parameter.trigger)
    );
    const texts: PromptText[] = params.map((param) => ({
      name: param.name,
      message: param.description,
    }));
    return texts;
  }
  getMainParameters(): PromptText[] {
    return this.#getScopeParameters(this.mainDecision)
  }

  getFragmentParameters(): PromptText[] {
    return this.#getScopeParameters(this.mainDecision.fragment)
  }
  #getScopeTemplate(decisionRoute: DecisionRoute): Template | false {
    const templates = decisionRoute.templates.filter((parameter) =>
      this.tagManager.matchTrigger(parameter.trigger)
    );
    const template = templates[0];
    return template ? template : false;
  }
  getMainTemplate(): Template | false {
    return this.#getScopeTemplate(this.mainDecision)
  }
  getFragmentTemplate(): Template | false {
    return this.#getScopeTemplate(this.mainDecision.fragment)
  }
  setMainDecisionTaken(parameters: ParameterValue[]) {
    const mainTemplate = this.getMainTemplate();
    const template = mainTemplate ? mainTemplate.value : 'no-template-found';
    const decisionTaken: DecisionTaken = { parameters, template };
    this.mainDecisionTaken = decisionTaken;
    this.#resetTagManager();
  }
  getMainDecisionTaken(): DecisionTaken {
    return this.mainDecisionTaken;
  }
}
