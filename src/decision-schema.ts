import Ajv from 'ajv';
import { JSONSchemaType } from 'ajv';
import { MainDecision } from './decision';

type Question = MainDecision['questions'][number];
type Parameter = MainDecision['parameters'][number];

const titleMaxLength = 40;
const descriptionMaxLength = 120;
const tagsMaxLength = 200;
const triggerMaxLength = 200;
const templateMaxLength = 1000;

const questionSchema: JSONSchemaType<Question> = {
  description: 'A question that will be presented as a selection',
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'A short title for the question',
      minLength: 1,
      maxLength: titleMaxLength,
    },
    description: {
      type: 'string',
      description: 'A description or hint for the question',
      minLength: 1,
      maxLength: descriptionMaxLength,
    },
    tags: {
      type: 'string',
      description: 'A list of tags separated by spaces',
      maxLength: tagsMaxLength,
    },
    trigger: {
      type: 'string',
      description: 'A list of tags expected to be present',
      maxLength: triggerMaxLength,
    },
  },
  required: ['title', 'description', 'tags', 'trigger'],
};

const parameterSchema: JSONSchemaType<Parameter> = {
  type: 'object',
  properties: {
    trigger: {
      type: 'string',
      description: 'A list of tags expected to be present',
      maxLength: triggerMaxLength,
    },
    name: {
      type: 'string',
      description: 'A short unique name for the parameter',
      minLength: 1,
      maxLength: titleMaxLength,
    },
    description: {
      type: 'string',
      description: 'A description or hint for the parameter',
      minLength: 1,
      maxLength: descriptionMaxLength,
    },
  },
  required: ['trigger', 'name', 'description'],
};

export const decisionSchema: JSONSchemaType<MainDecision> = {
  type: 'object',
  $id: 'https://github.com/flarebyte/baldrick-decision/baldrick-decision.schema.json',
  title: 'Schema for providing an interactive checklist to make decision',
  properties: {
    title: {
      type: 'string',
      description: 'A short title for the main decision',
      minLength: 1,
      maxLength: titleMaxLength,
    },
    description: {
      type: 'string',
      description: 'A description or hint for the main decision',
      minLength: 1,
      maxLength: descriptionMaxLength,
    },
    questions: {
      type: 'array',
      description: 'A list of questions that will be presented as a selection',
      items: questionSchema,
      minItems: 1,
    },
    parameters: {
      type: 'array',
      description: 'A list of parameters that will need to be populated',
      items: parameterSchema,
    },
    template: {
      type: 'string',
      description: 'A template using the mustache syntax',
      minLength: 1,
      maxLength: templateMaxLength,
    },
    fragment: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'A short title for the fragment',
          minLength: 1,
          maxLength: titleMaxLength,
        },
        description: {
          type: 'string',
          description: 'A description or hint for the fragment',
          minLength: 1,
          maxLength: descriptionMaxLength,
        },
        questions: {
          type: 'array',
          description:
            'A list of questions that will be presented as a selection',
          items: questionSchema,
          minItems: 1,
        },
        parameters: {
          type: 'array',
          description: 'A list of parameters that will need to be populated',
          items: parameterSchema,
        },
      },
      required: ['title', 'description', 'questions', 'parameters'],
    },
  },
  required: [
    'title',
    'description',
    'questions',
    'parameters',
    'template',
    'fragment',
  ],
};

console.log(JSON.stringify(decisionSchema, null, 2));

export const createMainDecisionValidator = () => {
  const ajv = new Ajv();
  return ajv.compile<MainDecision>(decisionSchema);
};
