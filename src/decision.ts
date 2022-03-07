import { TagManager } from './tag';

interface PromptChoice {
  title: string;
  description: string;
  value: string;
}

interface PromptText {
  title: string;
  description: string;
}

type PromptQuestions =
  | {
      kind: 'choices';
      choices: PromptChoice[];
    }
  | {
      kind: 'texts';
      texts: PromptText[];
    };

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

  constructor(mainDecision: MainDecision) {
    this.mainDecision = mainDecision;
  }

  #findQuestionsByTrigger(trigger: string): Question[] {
    return this.mainDecision.questions.filter(
      (question) => question.trigger === trigger
    );
  }

  getFollowUpMainQuestions(tag: string): PromptQuestions {
    const questions = this.#findQuestionsByTrigger(tag);
    const choices: PromptChoice[] = questions.map((question) => ({
      title: question.title,
      description: question.description,
      value: question.tags,
    }));
    return { kind: 'choices', choices };
  }

  getRootMainQuestions(): PromptQuestions {
    return this.getFollowUpMainQuestions('');
  }
  pushAnswerTags(tags: string) {
    this.tagManager.push(tags.split(' '));
  }
  getMainParameters(): PromptQuestions {
    const params = this.mainDecision.parameters.filter((parameter) =>
      this.tagManager.matchTrigger(parameter.trigger)
    );
    const texts: PromptText[] = params.map((param) => ({
      title: param.name,
      description: param.description,
    }));
    return { kind: 'texts', texts };
  }
  getMainTemplates(): Template[] {
    const templates = this.mainDecision.templates.filter((parameter) =>
      this.tagManager.matchTrigger(parameter.trigger)
    );
    return templates;
  }
}
