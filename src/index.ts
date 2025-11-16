#!/usr/bin/env node
//imports
import { askQuestions } from './lib/promptArray.js';
import answerHandler from './lib/answerHandler.js';

console.log('\nStarting Scaffolder...\n(Press CTRL+C to cancel anytime...)\n');

//start
askQuestions()
  .then((x) => answerHandler.handler(x))
  .then((x) => console.log(x))
  .catch((error) => {
    console.error('There was an unexpected error:');
    console.error(error);
  });
