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

/**
 * A decision manager keeps a record of the interaction with an user for a decision
 */
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

  #getMainQuestionsByTag(tag: string): PromptChoice[] {
    return this.#getScopeQuestionsByTag(this.mainDecision, tag);
  }

  #getFragmentQuestionsByTag(tag: string): PromptChoice[] {
    return this.#getScopeQuestionsByTag(this.mainDecision.fragment, tag);
  }

  /**
   * Get the initial questions for main
   */
  getRootMainQuestions(): PromptChoice[] {
    return this.#getMainQuestionsByTag('');
  }

  /**
   * Get the initial questions for a fragment
   */
  getRootFragmentQuestions(): PromptChoice[] {
    return this.#getFragmentQuestionsByTag('');
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
  /**
   * Get the followup questions once the initial questions have been asked for main
   */
  getFollowUpMainQuestions(): PromptChoice[] {
    return this.#getFollowUpScopeQuestions(this.mainDecision);
  }

  /**
   * Get the followup questions once the initial questions have been asked for a fragment
   */
  getFollowUpFragmentQuestions(): PromptChoice[] {
    return this.#getFollowUpScopeQuestions(this.mainDecision.fragment);
  }
  /**
   * Push the tags that correspond to an answer to internal stack
   * @param tags a list of tags separated by a space
   */
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
  /**
   * Automatically push the tags that are expected for main
   */
  pushMainAutoAnswerTags() {
    this.#pushScopeAutoAnswerTags(this.mainDecision);
  }
  /**
   * Automatically push the tags that are expected for a fragment
   */
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
  /**
   * Get an array of prompts for the main parameters
   */
  getMainParameters(): PromptText[] {
    return this.#getScopeParameters(this.mainDecision);
  }

  /**
   * Get an array of prompts for the parameters of a fragment
   */
  getFragmentParameters(): PromptText[] {
    return this.#getScopeParameters(this.mainDecision.fragment);
  }

  /**
   * Record all decisions taken by an user for main
   * @param parameters a list of parameters with name and and value
   */
  setMainDecisionTaken(parameters: ParameterValue[]) {
    const tagParameters: ParameterValue[] = this.tagManager
      .all()
      .map((name) => ({ name, value: true }));
    this._overallDecision.mainParameters = [...tagParameters, ...parameters];
    this.#resetTagManager();
  }

  /**
   * Record all decisions taken by an user for a fragment
   * @param parameters a list of parameters with name and and value
   */
  addFragmentDecisionTaken(parameters: ParameterValue[]) {
    const tagParameters: ParameterValue[] = this.tagManager
      .all()
      .map((name) => ({ name, value: true }));
    this._overallDecision.fragmentParameters.push([
      ...tagParameters,
      ...parameters,
    ]);
    this.#resetTagManager();
  }

  /**
   * The overall decision taken by the user
   */
  get overallDecision() {
    return this._overallDecision;
  }
}
