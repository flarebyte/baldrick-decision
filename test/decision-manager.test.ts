import { DecisionStore } from '../src/decision-manager';

describe('decision-manager', () => {
  it('should provide', () => {
    const actual = new DecisionStore();
    expect(actual).toBeDefined();
  });
});
