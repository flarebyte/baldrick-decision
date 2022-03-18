# Internal

> Overview of the code base of baldrick-decision

This document has been generated automatically by
[baldrick-doc-ts](https://github.com/flarebyte/baldrick-doc-ts)

## Diagram of the dependencies

```mermaid
classDiagram
class `client.ts`{
  +runClient()
  - askMainQuestions()
  - askFragmentQuestions()
}
class `decision-hydrator.ts`{
  - toHydrateParameters()
  +hydrate()
}
class `decision-schema.ts`{
  +writeJsonSchema()
  +createMainDecisionValidator()
}
class `decision-store.ts`
class `decision.ts`
class `index.ts`
class `model.ts`
class `prompting.ts`{
  +promptDecisionFile()
  +promptQuestions()
  +promptParameter()
  +promptAnotherFragmentQuestion()
}
class `tag.ts`{
  - isOpenTag()
  - toOpen()
}
class `version.ts`
class `node:path`{
  +path()
}
class `commander`{
  +Command()
}
class `./decision-hydrator.js`{
  +hydrate()
}
class `./decision-store.js`{
  +DecisionStore()
}
class `./decision.js`{
  +MainDecision()
  +OverallDecision()
  +ParameterValue()
  +DecisionManager()
}
class `./prompting.js`{
  +promptQuestions()
  +promptParameter()
  +promptDecisionFile()
  +promptAnotherFragmentQuestion()
}
class `./version.js`{
  +version()
}
class `./decision-schema.js`{
  +createMainDecisionValidator()
  +writeJsonSchema()
}
class `mustache`{
  +Mustache()
}
class `ajv`{
  +Ajv()
}
class `fs-jetpack`{
  +jetpack()
}
class `yaml`{
  +YAML()
}
class `./model.js`{
  +PromptText()
  +PromptChoice()
}
class `./tag.js`{
  +TagManager()
}
class `prompts`{
  +prompts()
}
`client.ts`-->`node:path`
`client.ts`-->`commander`
`client.ts`-->`./decision-hydrator.js`
`client.ts`-->`./decision-store.js`
`client.ts`-->`./decision.js`
`client.ts`-->`./prompting.js`
`client.ts`-->`./version.js`
`client.ts`-->`./decision-schema.js`
`decision-hydrator.ts`-->`mustache`
`decision-hydrator.ts`-->`./decision.js`
`decision-schema.ts`-->`ajv`
`decision-schema.ts`-->`fs-jetpack`
`decision-schema.ts`-->`./decision.js`
`decision-store.ts`-->`yaml`
`decision-store.ts`-->`fs-jetpack`
`decision-store.ts`-->`./decision.js`
`decision-store.ts`-->`./decision-schema.js`
`decision-store.ts`-->`./model.js`
`decision.ts`-->`./model.js`
`decision.ts`-->`./tag.js`
`prompting.ts`-->`prompts`
`prompting.ts`-->`./model.js`
```
