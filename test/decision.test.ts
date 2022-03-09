import { DecisionManager, MainDecision } from '../src/decision';

const exampleDecision: MainDecision = {
  title: 'Create interface',
  description: 'Create a typescript interface',
  questions: [
    {
      title: 'This is an interface',
      description: 'Is this an interface',
      tags: 'interface',
      trigger: 'auto',
    },
    {
      title: 'This an extension',
      description: 'Is the interface going to extend another',
      tags: 'extends has/?',
      trigger: '',
    },
    {
      title: 'This is going be a class',
      description: 'This interface is going to be a class eventually',
      tags: 'has/class',
      trigger: 'has/?',
    },
  ],
  parameters: [
    {
      trigger: 'interface',
      name: 'name',
      description: 'Name of the interface',
    },
    {
      trigger: 'extends',
      name: 'base_interface',
      description: 'Name of the base interface',
    },
    {
      trigger: 'has/class',
      name: 'class_name',
      description: 'Name of the class',
    },
  ],
  templates: [
    {
      trigger: 'interface extends has/class',
      value: [
        'class {{class_name}} interface {{name}} extends {{base_interface}}',
        '{{fragments}}',
        'end of class',
      ].join('\n'),
    },

    {
      trigger: 'interface extends',
      value: 'interface {{name}} extends {{base_interface}}',
    },
    {
      trigger: 'interface',
      value: 'interface {{name}}',
    },
  ],
  fragment: {
    title: 'field',
    description: 'Description of a field',
    questions: [
      {
        title: 'This is a field',
        description: 'Is this a field',
        tags: 'field',
        trigger: 'auto',
      },
      {
        title: 'has a type',
        description: 'Type of the field',
        tags: 'type/?',
        trigger: '',
      },
      {
        title: 'string',
        description: 'This is a string field',
        tags: 'type/string',
        trigger: 'type/?',
      },
      {
        title: 'boolean',
        description: 'This is a boolean field',
        tags: 'type/boolean',
        trigger: 'type/?',
      },
      {
        title: 'Advanced type',
        description: 'This is an advanced type field',
        tags: 'type/advanced',
        trigger: 'type/?',
      },
    ],
    parameters: [
      {
        trigger: 'field',
        name: 'name',
        description: 'Name of the field',
      },
      {
        trigger: 'type/advanced',
        name: 'advanced_type',
        description: 'Name of the advanced type',
      },
    ],
    templates: [
      {
        trigger: 'field type/string',
        value: '{{name}}: string',
      },
      {
        trigger: 'field type/boolean',
        value: '{{name}}: boolean',
      },
      {
        trigger: 'field type/advanced',
        value: '{{name}}: {{advanced_type}}',
      },
      {
        trigger: 'field',
        value: '{{name}}',
      },
    ],
  },
};

describe('DecisionManager', () => {
  it('should provide root main questions', () => {
    console.log(JSON.stringify(exampleDecision, null, 2))
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
  it('should the most suitable template', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    decisionManager.getRootMainQuestions();
    decisionManager.pushMainAutoAnswerTags();
    decisionManager.pushAnswerTags('extends has/?');
    decisionManager.getFollowUpMainQuestions();
    decisionManager.pushAnswerTags('has/class');
    decisionManager.getFollowUpMainQuestions();
    expect(decisionManager.getMainTemplate()).toMatchInlineSnapshot(`
      Object {
        "trigger": "interface extends has/class",
        "value": "class {{class_name}} interface {{name}} extends {{base_interface}}
      {{fragments}}
      end of class",
      }
    `);
  });
  it('should the most fallback template', () => {
    const decisionManager = new DecisionManager(exampleDecision);
    decisionManager.getRootMainQuestions();
    decisionManager.pushMainAutoAnswerTags();
    decisionManager.getFollowUpMainQuestions();
    decisionManager.getFollowUpMainQuestions();
    expect(decisionManager.getMainTemplate()).toMatchInlineSnapshot(`
      Object {
        "trigger": "interface",
        "value": "interface {{name}}",
      }
    `);
    decisionManager.setMainDecisionTaken([{ name: 'name', value: 'Commands' }]);
    expect(decisionManager.getMainDecisionTaken()).toMatchInlineSnapshot(`
      Object {
        "parameters": Array [
          Object {
            "name": "name",
            "value": "Commands",
          },
        ],
        "template": "interface {{name}}",
      }
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

    expect(decisionManager.getFragmentDecisionTakenList())
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "parameters": Array [
            Object {
              "name": "name",
              "value": "description",
            },
          ],
          "template": "{{name}}",
        },
        Object {
          "parameters": Array [
            Object {
              "name": "name",
              "value": "title",
            },
          ],
          "template": "{{name}}: string",
        },
      ]
    `);
  });
});
