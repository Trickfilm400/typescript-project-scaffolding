#!/usr/bin/env node
//imports
import inquirer from 'inquirer';
import { promptArray } from './lib/promptArray.js';
import answerHandler from './lib/answerHandler.js';

console.log('\nStarting Scaffolder...\n(Press CTRL+C to cancel anytime...\n');

//start
inquirer
  .prompt(promptArray)
  .then((x) => answerHandler.handler(x))
  .then((x) => console.log(x))
  .catch((error) => {
    console.error('There was an unexpected error:');
    console.error(error);
  });
