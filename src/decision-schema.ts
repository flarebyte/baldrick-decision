import { JSONSchemaType } from "ajv";
import { MainDecision } from "./decision";

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
      items: [
        {
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
        },
        {
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
        },
        {
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
        },
      ],
    },
    parameters: {
      type: 'array',
      items: [
        {
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
        },
        {
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
        },
        {
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
        },
      ],
    },
    templates: {
      type: 'array',
      items: [
        {
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
        },
        {
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
        },
        {
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
        },
      ],
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
          items: [
            {
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
            },
            {
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
            },
            {
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
            },
            {
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
            },
            {
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
            },
          ],
        },
        parameters: {
          type: 'array',
          items: [
            {
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
            },
            {
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
            },
          ],
        },
        templates: {
          type: 'array',
          items: [
            {
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
            },
            {
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
            },
            {
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
            },
            {
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
            },
          ],
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
