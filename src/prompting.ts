import prompts from 'prompts';
import { PromptChoice, PromptText } from './model.js';

export const promptDecisionFile = async (
  choices: PromptChoice[]
): Promise<string> => {
  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Select the decision file',
    choices,
  });

  return response.value;
};

export const promptQuestions = async (
  choices: PromptChoice[]
): Promise<string[]> => {
  const response = await prompts({
    type: 'multiselect',
    name: 'value',
    message: 'Pick the suitable answers',
    choices,
    hint: '- Space to select. Return to submit',
  });

  return response.value;
};

export const promptParameter = async (
  promptText: PromptText
): Promise<string> => {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: promptText.message,
  });

  return response.value;
};

export const promptAnotherFragmentQuestion = async (): Promise<boolean> => {
  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Is there another fragment ?',
    initial: false,
  });

  return response.value;
};
