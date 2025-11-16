import { IPrompt } from '../interfaces/IPrompt.js';
import { additionalObjects, mP } from '../util/helper.js';
import Name from './answerHandlers/name.js';
import { spawn } from 'child_process';
import { checkbox, confirm, input, select } from '@inquirer/prompts';

/**
 * Array with questions for the user for how to set up the new project
 * @interface IPrompt - The Interface used for saving the answers
 * @version 2.0.0
 * @author Nico W.
 * @since 05.11.2022
 */
export async function askQuestions() {
  const promptArray: IPrompt = <IPrompt>{};
  promptArray['project-name'] = await input({
    message: mP() + 'The name of the project (. for current directory):',
    ...additionalObjects,
    validate(input: string): boolean | string | Promise<boolean | string> {
      return Name.validate(input);
    },
  });
  promptArray['project-type'] = await select({
    choices: ['http-api@express-utils', 'websocket-server', 'socket-io-server', 'npm-package', 'empty-project'],
    message: mP() + 'Please select the type of project you want to create:',
    ...additionalObjects,
  });
  if (promptArray['project-type'] !== 'npm-package') {
    promptArray['project-dockerfile-enabled'] = await confirm({
      message: mP() + 'Add Dockerfile?',
      default: true,
      ...additionalObjects,
    });
  }
  promptArray['project-cicd-pipeline'] = await select({
    choices: ['gitlab', 'github', 'none'],
    message: mP() + 'Select the CI-CD Pipeline Template:',
    default: 'github',
    ...additionalObjects,
  });
  promptArray['project-additional-dependencies'] = await checkbox({
    choices: [
      { name: 'eslint_prettier', value: 'eslint_prettier', checked: true },
      { name: 'convict', value: 'convict' },
      { name: 'ts-node-dev', value: 'ts-node-dev', checked: true },
      { name: 'winston', value: 'winston', checked: true },
      { name: 'joi', value: 'joi' },
      { name: 'amqp', value: 'amqp' },
      { name: 'mqtt', value: 'mqtt' },
    ],
    message: mP() + 'Additional Packages:',
    ...additionalObjects,
  });
  promptArray['project-testing-dependencies'] = await checkbox({
    choices: ['mocha', 'chai-http', 'nyc', 'cypress', 'jest', 'vitest'],
    message: mP() + 'Testing Packages:',
    ...additionalObjects,
  });
  promptArray['project-database-driver'] = await checkbox({
    choices: ['mongoose', 'typeorm', 'mysql', 'mysql2', 'mongodb', 'redis'],
    message: mP() + 'Database Driver:',
    ...additionalObjects,
  });
  promptArray['project-ncu-packages'] = await confirm({
    message:
      mP() + 'Run ncu (npm-check-updates) to force-install all latest package versions? (MAY BREAK EXAMPLE FILES):',
    default: false,
    ...additionalObjects,
  });

  promptArray['project-npm-install-packages'] = await confirm({
    message: mP() + 'Run npm install to install dependencies?',
    default: false,
    ...additionalObjects,
  });
  try {
    spawn('git', ['--version']);
    promptArray['project-git-init'] = await confirm({
      message: mP() + 'Run git init to initialize git?',
      default: false,
      ...additionalObjects,
    });
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  } catch (e) {
    /* empty */
  }
  promptArray['project-idea'] = await checkbox({
    choices: ['prettier', 'eslint'],
    message: mP() + 'Select .idea Folder Config files settings:',
    ...additionalObjects,
  });
  return promptArray;
}
