import Ajv from 'ajv';
import { JSONSchemaType } from 'ajv';
import { MainDecision } from './decision';

type Question = MainDecision['questions'][number];
type Parameter = MainDecision['parameters'][number];
type Template = MainDecision['templates'][number];

const questionSchema: JSONSchemaType<Question> = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    tags: {
      type: 'string',
    },
    trigger: {
      type: 'string',
    },
  },
  required: ['title', 'description', 'tags', 'trigger'],
};

const parameterSchema: JSONSchemaType<Parameter> = {
  type: 'object',
  properties: {
    trigger: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
  required: ['trigger', 'name', 'description'],
};

const templateSchema: JSONSchemaType<Template> = {
  type: 'object',
  properties: {
    trigger: {
      type: 'string',
    },
    value: {
      type: 'string',
    },
  },
  required: ['trigger', 'value'],
};

export const decisionSchema: JSONSchemaType<MainDecision> = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    questions: {
      type: 'array',
      items: questionSchema,
    },
    parameters: {
      type: 'array',
      items: parameterSchema,
    },
    templates: {
      type: 'array',
      items: templateSchema,
    },
    fragment: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        questions: {
          type: 'array',
          items: questionSchema,
        },
        parameters: {
          type: 'array',
          items: parameterSchema,
        },
        templates: {
          type: 'array',
          items: templateSchema,
        },
      },
      required: [
        'title',
        'description',
        'questions',
        'parameters',
        'templates',
      ],
    },
  },
  required: [
    'title',
    'description',
    'questions',
    'parameters',
    'templates',
    'fragment',
  ],
};

export const createMainDecisionValidator = () => {
  const ajv = new Ajv();
  return ajv.compile<MainDecision>(decisionSchema);
};