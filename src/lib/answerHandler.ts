import Name from './answerHandlers/name.js';
import { IPrompt } from '../interfaces/IPrompt.js';
import BuildPackageJson from './answerHandlers/buildPackageJson.js';
import { CreateNewProjectFiles } from './answerHandlers/createNewProjectFiles.js';
import { spawn } from 'child_process';

/**
 * Handler Class for handling the answers given by user suer select menu
 * @version 1.0.0
 * @author Nico W.
 * @since 06.11.2022
 * @class
 */
class AnswerHandler {
  private answers: IPrompt;
  private prepare_package_json: BuildPackageJson;
  private prepare_CreateNewProjectFiles: CreateNewProjectFiles;

  /**
   * Handler Function for the menu library
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @param {IPrompt} answers - Given answers array to use
   */
  async handler(answers: IPrompt) {
    this.answers = answers;
    this.prepare();
    return this.run();
  }

  /**
   * Prepare Variables and Classes
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @private
   */
  private prepare() {
    console.log('\n\nPreparing...');
    new Name(this.answers['project-name']);
    console.log('Creating package.json file...');
    this.prepare_package_json = new BuildPackageJson(Name.PROJECT_NAME, this.answers);
    console.log('Creating project files...');
    this.prepare_CreateNewProjectFiles = new CreateNewProjectFiles(this.answers, Name.PROJECT_PATH, Name.PROJECT_NAME);
  }

  /**
   * Run the tasks after the preparation for creating the new project
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @private
   */
  private async run(): Promise<string> {
    if (this.answers['project-ncu-packages']) {
      console.log('Updating packages...');
      try {
        await this.prepare_package_json.fetchLatestPackageVersions();
      } catch (error) {
        console.log(error);
        return error;
      }
    }
    console.log('Saving package.json file...');
    this.prepare_package_json.save(Name.PROJECT_PATH);
    console.log('Writing project files to disk...');
    this.prepare_CreateNewProjectFiles.run();
    if (this.answers['project-npm-install-packages']) {
      console.log('Installing packages (running "npm install")...');
      try {
        let npmCommand = 'npm';
        if (process.platform === 'win32') {
          npmCommand = 'npm.cmd';
        }
        const r = spawn(npmCommand, ['install'], { cwd: Name.PROJECT_PATH });
        r.stdout.on('data', (x) => console.log(x.toString()));
        r.stderr.on('data', (x) => console.log(x.toString()));
        r.on('error', (x) => console.error(x));
      } catch (e) {
        console.log(e);
      }
    }
    // git init
    if (this.answers['project-git-init']) {
      console.log('Initializing git (running "git init")...');
      try {
        const r = spawn('git', ['init'], { cwd: Name.PROJECT_PATH });
        r.stdout.on('data', (x) => console.log(x.toString()));
        r.stderr.on('data', (x) => console.log(x.toString()));
        r.on('error', (x) => console.error(x));
      } catch (e) {
        console.log(e);
      }
    }
    return `\n\nSuccessfully created new project (${Name.PROJECT_NAME})\n\n:)`;
  }
}

export default new AnswerHandler();
