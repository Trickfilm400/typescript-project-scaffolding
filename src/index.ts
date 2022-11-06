#!/usr/bin/env node
//imports
import inquirer from 'inquirer';
import { promptArray } from './lib/promptArray.js';
import answerHandler from './lib/answerHandler.js';

console.log('\nStarting Scaffolder...\n');

//start
inquirer
  .prompt(promptArray)
  .then((x) => answerHandler.handler(x))
  .catch((error) => {
    console.error('There was an unexpected error:');
    console.error(error);
  });
