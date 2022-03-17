import { PromptChoice, PromptText } from './model.js';
import { TagManager } from './tag.js';

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

interface DecisionRoute {
  title: string;
  description: string;
  questions: Question[];
  parameters: Parameter[];
}

export interface ParameterValue {
  name: string;
  value: string | boolean;
}

export interface OverallDecision {
  mainParameters: ParameterValue[];
  fragmentParameters: ParameterValue[][];
  template: string;
}

export interface MainDecision extends DecisionRoute {
  fragment: DecisionRoute;
  template: string;
}

export class DecisionManager {
  private mainDecision: MainDecision;
  private tagManager = new TagManager();
  private _overallDecision: OverallDecision;

  constructor(mainDecision: MainDecision) {
    this.mainDecision = mainDecision;
    this._overallDecision = {
      mainParameters: [],
      fragmentParameters: [],
      template: mainDecision.template,
    };
  }

  #resetTagManager() {
    this.tagManager = new TagManager();
  }
  #findScopeQuestionsByTrigger(
    decisionRoute: DecisionRoute,
    trigger: string
  ): Question[] {
    return decisionRoute.questions.filter(
      (question) => question.trigger === trigger
    );
  }

  #getScopeQuestionsByTag(
    decisionRoute: DecisionRoute,
    tag: string
  ): PromptChoice[] {
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
      choices = [...choices, ...questions];
      this.tagManager.deleteOpen(tag);
    }
    return choices;
  }
  getFollowUpMainQuestions(): PromptChoice[] {
    return this.#getFollowUpScopeQuestions(this.mainDecision);
  }
  getFollowUpFragmentQuestions(): PromptChoice[] {
    return this.#getFollowUpScopeQuestions(this.mainDecision.fragment);
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
    this.#pushScopeAutoAnswerTags(this.mainDecision);
  }
  pushFragmentAutoAnswerTags() {
    this.#pushScopeAutoAnswerTags(this.mainDecision.fragment);
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
    return this.#getScopeParameters(this.mainDecision);
  }

  getFragmentParameters(): PromptText[] {
    return this.#getScopeParameters(this.mainDecision.fragment);
  }

  setMainDecisionTaken(parameters: ParameterValue[]) {
    this._overallDecision.mainParameters = parameters;
    this.#resetTagManager();
  }

  addFragmentDecisionTaken(parameters: ParameterValue[]) {
    this._overallDecision.fragmentParameters.push(parameters);
    this.#resetTagManager();
  }

  get overallDecision() {
    return this._overallDecision;
  }
}
