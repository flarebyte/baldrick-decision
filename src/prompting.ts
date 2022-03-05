import prompts from 'prompts';
import path from 'node:path';

const customFileSuggest = (input: string, choices: prompts.Choice[]) =>
  Promise.resolve(
    choices.filter((i) => i.title.toLowerCase().includes(input.toLowerCase()))
  );

export const promptFilename = async (filenames: string[]): Promise<string> => {
  const currentDir = process.cwd();
  const response = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: 'Select the destination file',
    suggest: customFileSuggest,
    choices: filenames.map((s) => ({
      title: path.relative(currentDir, s),
      value: s,
    })),
  });

  return response.value;
};