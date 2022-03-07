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
      trigger: 'interface',
      value: 'interface {{name}}',
    },
    {
      trigger: 'interface extends',
      value: 'interface {{name}} extends {{base_interface}}',
    },
    {
      trigger: 'interface extends has/class',
      value: [
        'class {{class_name}} interface {{name}} extends {{base_interface}}',
        '{{fragments}}',
        'end of class',
      ].join('\n'),
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
    templates: [{
        trigger: 'field',
        value: '{{name}}',
      },
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

    ]
  },
};

describe('DecisionManager', () => {
  it('should provide', () => {
    const opts = {};
    const actual = new DecisionManager(exampleDecision);
    expect(actual).toMatchInlineSnapshot();
  });
});
