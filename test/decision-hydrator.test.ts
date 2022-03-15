import { OverallDecision } from '../src/decision';
import {  hydrate } from '../src/decision-hydrator';


const aaa: OverallDecision = {
    mainParameters: [{name: 'project', value: 'project-name'}],
    fragmentParameters: [],
    template: ''
}
describe('decision-hydrator', () => {
  it('should provide', () => {
    const opts = {};
    const actual = (opts);
    expect(actual).toMatchInlineSnapshot();
  });
});
