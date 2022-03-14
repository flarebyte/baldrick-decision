import { DecisionManager } from '../src/decision';
import { exampleDecision } from './decision-fixture';

describe('DecisionManager', () => {
  it('should provide root main questions', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    expect(decisionManager.getRootMainQuestions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "Is the interface going to extend another",
          "title": "This an extension",
          "value": "extends has/?",
        },
      ]
    `);
  });
  it('should provide follow up main questions', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    decisionManager.pushAnswerTags('extends has/?');
    expect(decisionManager.getFollowUpMainQuestions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "This interface is going to be a class eventually",
          "title": "This is going be a class",
          "value": "has/class",
        },
      ]
    `);
  });
  it('should reach the end of question if selection', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    decisionManager.getRootMainQuestions();
    decisionManager.pushAnswerTags('extends has/?');
    decisionManager.getFollowUpMainQuestions();
    decisionManager.pushAnswerTags('has/class');
    expect(decisionManager.getFollowUpMainQuestions()).toHaveLength(0);
  });
  it('should reach the end of question even if no selection', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    decisionManager.getRootMainQuestions();
    decisionManager.pushAnswerTags('extends has/?');
    decisionManager.getFollowUpMainQuestions();
    expect(decisionManager.getFollowUpMainQuestions()).toHaveLength(0);
  });
  it('should ask for every parameter if needed', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    decisionManager.getRootMainQuestions();
    decisionManager.pushMainAutoAnswerTags();
    decisionManager.pushAnswerTags('extends has/?');
    decisionManager.getFollowUpMainQuestions();
    decisionManager.pushAnswerTags('has/class');
    decisionManager.getFollowUpMainQuestions();
    expect(decisionManager.getMainParameters()).toMatchInlineSnapshot(`
      Array [
        Object {
          "message": "Name of the interface",
          "name": "name",
        },
        Object {
          "message": "Name of the base interface",
          "name": "base_interface",
        },
        Object {
          "message": "Name of the class",
          "name": "class_name",
        },
      ]
    `);
  });
  it('should ask just for the needed parameter', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    decisionManager.getRootMainQuestions();
    decisionManager.pushMainAutoAnswerTags();
    decisionManager.getFollowUpMainQuestions();
    decisionManager.getFollowUpMainQuestions();
    expect(decisionManager.getMainParameters()).toMatchInlineSnapshot(`
      Array [
        Object {
          "message": "Name of the interface",
          "name": "name",
        },
      ]
    `);
  });
  it('should ask for fragment as well', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    decisionManager.getRootMainQuestions();
    decisionManager.pushMainAutoAnswerTags();
    decisionManager.getFollowUpMainQuestions();
    decisionManager.getFollowUpMainQuestions();
    decisionManager.setMainDecisionTaken([{ name: 'name', value: 'Commands' }]);

    // First field
    decisionManager.getRootFragmentQuestions();
    decisionManager.pushFragmentAutoAnswerTags();
    decisionManager.getFollowUpFragmentQuestions();
    decisionManager.getFollowUpFragmentQuestions();
    decisionManager.getFollowUpFragmentQuestions();
    decisionManager.addFragmentDecisionTaken([
      { name: 'name', value: 'description' },
    ]);

    // Second field
    decisionManager.getRootFragmentQuestions();
    decisionManager.pushFragmentAutoAnswerTags();
    decisionManager.pushAnswerTags('type/?');
    decisionManager.getFollowUpFragmentQuestions();
    decisionManager.pushAnswerTags('type/string');
    decisionManager.getFollowUpFragmentQuestions();
    decisionManager.getFollowUpFragmentQuestions();
    decisionManager.addFragmentDecisionTaken([
      { name: 'name', value: 'title' },
    ]);

    expect(decisionManager.overallDecision).toMatchInlineSnapshot(`
      Object {
        "fragmentParameters": Array [
          Array [
            Object {
              "name": "name",
              "value": "description",
            },
          ],
          Array [
            Object {
              "name": "name",
              "value": "title",
            },
          ],
        ],
        "mainParameters": Array [
          Object {
            "name": "name",
            "value": "Commands",
          },
        ],
        "template": "class {{class_name}} interface {{name}} extends {{base_interface}}
      {{fragments}}
      end of class",
      }
    `);
  });
});
