import { OverallDecision } from '../src/decision';
import { hydrate } from '../src/decision-hydrator';

const example: OverallDecision = {
  mainParameters: [
    { name: 'project', value: 'project-name' },
    { name: 'homepage', value: 'http//homepage.com' },
    { name: 'is-cutting-edge', value: true },
  ],
  fragmentParameters: [
    [
      { name: 'name', value: 'green' },
      { name: 'year', value: '2022' },
      { name: 'is-open-source', value: true },
    ],
    [
      { name: 'name', value: 'orange' },
      { name: 'year', value: '2020' },
      { name: 'is-open-source', value: false },
    ],
    [{ name: 'name', value: 'red' }],
  ],
  template: `
  Project: {{main.project}}
  Homepage: {{main.homepage}}
  {{#main.is-cutting-edge}} cutting-edge {{/main.is-cutting-edge}}
  
  Fragments:
  
    ||name||year|| open||

  {{#fragments}}
    |{{name}}|{{year}}|{{#is-open-source}}yes{{/is-open-source}}|
  {{/fragments}}
  
  License: MIT
  `,
};

describe('decision-hydrator', () => {
  it('should hydrate a template', () => {
    const actual = hydrate(example);
    expect(actual).toMatchInlineSnapshot(`
      "
        Project: project-name
        Homepage: http//homepage.com
         cutting-edge 
  
        Fragments:
  
          ||name||year|| open||

          |green|2022|yes|
          |orange|2020||
          |red|||
  
        License: MIT
        "
    `);
  });
});
