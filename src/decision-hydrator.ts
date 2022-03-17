import Mustache from 'mustache';
import { OverallDecision } from './decision.js';

type KeyValueObj = { [key: string]: string | boolean };

export interface HydrateParameters {
  main: KeyValueObj;
  fragments: KeyValueObj[];
}

const toHydrateParameters = (
  overallDecision: OverallDecision
): HydrateParameters => {
  const main: KeyValueObj = Object.fromEntries(
    overallDecision.mainParameters.map((param) => [param.name, param.value])
  );
  const fragments: KeyValueObj[] = overallDecision.fragmentParameters.map(
    (fragment) =>
      Object.fromEntries(fragment.map((param) => [param.name, param.value]))
  );
  return { main, fragments };
};

/**
 *  Custom global config for Mustache
 */
Mustache.escape = function (text) {
  return text;
};

export const hydrate = (overallDecision: OverallDecision): string =>
  Mustache.render(
    overallDecision.template,
    toHydrateParameters(overallDecision)
  );
