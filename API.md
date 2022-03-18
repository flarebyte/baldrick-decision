# API of baldrick-decision

> List of functions and variables for `baldrick-decision`

**Functions:**

-   [createMainDecisionValidator](API.md#createMainDecisionValidator)
-   [hydrate](API.md#hydrate)
-   [writeJsonSchema](API.md#writeJsonSchema)

**Variables:**

-   [decisionSchema](API.md#decisionSchema)

## createMainDecisionValidator

⎔ Factory for a validator for the decision schema

### Parameters

### Returns

an AJV validator

See [decision-schema.ts -
L161](https://github.com/flarebyte/baldrick-decision/blob/main/src/decision-schema.ts#L161)

## hydrate

⎔ Hydrate the data provided by the user and apply the mustache template

### Parameters

-   overallDecision: `OverallDecision`: the overall decision choices and
    inputs by the user

### Returns

a snippet of text

See [decision-hydrator.ts -
L39](https://github.com/flarebyte/baldrick-decision/blob/main/src/decision-hydrator.ts#L39)

## writeJsonSchema

⎔ Write the JSON Schema for a decision document

### Parameters

-   filename: `string`: the filename for the JSON Schema

See [decision-schema.ts -
L150](https://github.com/flarebyte/baldrick-decision/blob/main/src/decision-schema.ts#L150)

## decisionSchema

`undefined`

The JSON schema (Ajv format) for creating decisions documents

See [decision-schema.ts -
L71](https://github.com/flarebyte/baldrick-decision/blob/main/src/decision-schema.ts#L71)
