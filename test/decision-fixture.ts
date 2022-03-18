import YAML from 'yaml';
import { MainDecision } from '../src/decision';

export const exampleDecision: MainDecision = {
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
  },
  template: [
    'class {{class_name}} interface {{name}} extends {{base_interface}}',
    '{{fragments}}',
    'end of class',
  ].join('\n'),
};

export const exampleDecisionAsYaml = YAML.stringify(exampleDecision);
