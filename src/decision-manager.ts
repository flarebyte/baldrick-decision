interface PromptChoice {
  title: string;
  description: string;
  value: string;
}

interface Question {
  title: string;
  description: string;
  tags: string[];
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

interface MainDecision extends DecisionRoute {
  fragments: DecisionRoute[];
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

class DecisionManager {
  mainDecision: MainDecision;
  constructor(mainDecision: MainDecision) {
    this.mainDecision = mainDecision;
  }
}
