import { QuestionCollection } from 'inquirer';
import { IPrompt } from '../interfaces/IPrompt.js';
import { additionalObjects, mP } from '../util/helper.js';
import Name from './answerHandlers/name.js';
import { spawn } from 'child_process';

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
      return Name.validate(input);
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
    default: true,
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
    choices: ['eslint', 'prettier', 'convict', 'ts-node-dev', 'winston', 'joi', 'amqp', 'mqtt'],
    name: 'project-additional-dependencies',
    message: mP() + 'Additional Packages:',
    default: ['eslint', 'prettier', 'ts-node-dev', 'winston'],
    ...additionalObjects,
  },
  {
    type: 'confirm',
    name: 'project-testing-enabled',
    message: mP() + 'Add Test-Frameworks?',
    default: true,
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
    choices: ['mongoose', 'typeorm', 'mysql', 'mysql2', 'mongodb', 'redis'],
    message: mP() + 'Database Driver:',
    name: 'project-database-driver',
    ...additionalObjects,
  },
  {
    type: 'confirm',
    message:
      mP() + 'Run ncu (npm-check-updates) to force-install all latest package versions? (MAY BREAK EXAMPLE FILES):',
    name: 'project-ncu-packages',
    default: false,
    ...additionalObjects,
  },
  {
    type: 'confirm',
    message: mP() + 'Run npm install to install dependencies?',
    name: 'project-npm-install-packages',
    default: false,
    ...additionalObjects,
  },
  {
    type: 'confirm',
    message: mP() + 'Run git init to initialize git?',
    name: 'project-git-init',
    default: false,
    ...additionalObjects,
    when: async () => {
      try {
        spawn('git', ['--version']);
        return true;
      } catch (e) {
        return false;
      }
    },
  },
];
