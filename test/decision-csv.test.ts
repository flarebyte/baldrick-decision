import { DecisionTable } from '../src/decision-csv';

describe('decision-csv', () => {
  it('should provide', () => {
    const actual = new DecisionTable();
    expect(actual).toBeDefined();
  });
});
