import { QuestionCollection } from 'inquirer';
import { IPrompt } from '../interfaces/IPrompt.js';
import { additionalObjects, mP } from '../util/helper.js';

/**
 * Array with questions for the user for how to set up the new project
 * @interface IPrompt - The Interface used for saving the answers
 * @version 1.0.0
 * @author Nico W.
 * @since 05.11.2022
 */
export const promptArray: QuestionCollection<IPrompt> = [
  {
    type: 'input',
    name: 'project-name',
    message: mP() + 'The name of the project (. for current directory):',
    ...additionalObjects,
    validate(input: string): boolean | string | Promise<boolean | string> {
      let isValidPathInput = /^(\/?[a-z0-9]+)+$/.test(input);
      if (!isValidPathInput && input === '.') isValidPathInput = true;
      return isValidPathInput ? true : "Please enter '.' for the current directory or a folder name like 'new-project'";
    },
  },
  {
    type: 'list',
    choices: ['http-api@express-utils', 'websocket-server', 'socket-io-server', 'npm-package', 'empty-project'],
    message: mP() + 'Please select the type of project you want to create:',
    name: 'project-type',
    ...additionalObjects,
  },
  {
    type: 'confirm',
    name: 'project-dockerfile-enabled',
    message: mP() + 'Add Dockerfile?',
    default: 'yes',
    ...additionalObjects,
    when: (answers) => answers['project-type'] !== 'npm-package',
  },
  {
    type: 'list',
    choices: ['gitlab', 'github', 'none'],
    name: 'project-cicd-pipeline',
    message: mP() + 'Select the CI-CD Pipeline Template:',
    default: 'github',
    ...additionalObjects,
  },
  {
    type: 'checkbox',
    choices: ['eslint', 'prettier', 'convict', 'ts-node-dev', 'winston', 'joi'],
    name: 'project-additional-dependencies',
    message: mP() + 'Additional Packages:',
    ...additionalObjects,
  },
  {
    type: 'confirm',
    name: 'project-testing-enabled',
    message: mP() + 'Add Test-Frameworks?',
    default: 'yes',
    ...additionalObjects,
  },
  {
    type: 'checkbox',
    choices: ['mocha', 'chai-http', 'nyc', 'cypress', 'jest', 'vitest'],
    name: 'project-testing-dependencies',
    message: mP() + 'Testing Packages:',
    ...additionalObjects,
    when: (answers) => answers['project-testing-enabled'],
  },
  {
    type: 'checkbox',
    choices: ['mongoose', 'typeorm', 'mysql', 'mysql2', 'mongodb', 'redis', 'none'],
    message: mP() + 'Database Driver:',
    name: 'project-database-driver',
    default: 'none',
    ...additionalObjects,
  },
  {
    type: 'confirm',
    message:
      mP() + 'Run ncu (npm-check-updates) to force-install all latest package versions? (MAY BREAK EXAMPLE FILES):',
    name: 'project-ncu-packages',
    default: 'no',
    ...additionalObjects,
  },
  {
    type: 'confirm',
    message: mP() + 'Run npm install to install dependencies?',
    name: 'project-npm-install-packages',
    default: 'no',
    ...additionalObjects,
  },
];
