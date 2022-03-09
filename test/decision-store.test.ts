import { DecisionStore } from '../src/decision-store';
import { exampleDecision, exampleDecisionAsYaml } from './decision-fixture';

describe('decision-store', () => {
  it('should load a valid yaml decision file', () => {
    const decisionStore = new DecisionStore();
    decisionStore.loadFromString('file.decision.yaml', exampleDecisionAsYaml);
    expect(decisionStore.decisions).toHaveLength(1);
    expect(decisionStore.messages).toHaveLength(0);
    const storedDecision = decisionStore.getByTitle(exampleDecision.title);
    expect(storedDecision).toBeTruthy();
  });

  it('should not load an invalid yaml decision file', () => {
    const decisionStore = new DecisionStore();
    decisionStore.loadFromString('invalid.decision.yaml', '');
    expect(decisionStore.decisions).toHaveLength(0);
    expect(decisionStore.messages).toMatchInlineSnapshot(`
      Array [
        "Invalid schema for YAML file: invalid.decision.yaml",
      ]
    `);
  });
});
