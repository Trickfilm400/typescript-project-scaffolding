import Name from './answerHandlers/name.js';
import { IPrompt } from '../interfaces/IPrompt.js';
import BuildPackageJson from './answerHandlers/buildPackageJson.js';
import { CreateNewProjectFiles } from './answerHandlers/createNewProjectFiles.js';

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
  handler(answers: IPrompt) {
    this.answers = answers;
    this.prepare();
    this.run();
  }

  /**
   * Prepare Variables and Classes
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @private
   */
  private prepare() {
    new Name(this.answers['project-name']);
    this.prepare_package_json = new BuildPackageJson(Name.PROJECT_NAME, this.answers);
    this.prepare_CreateNewProjectFiles = new CreateNewProjectFiles(this.answers, Name.PROJECT_PATH, Name.PROJECT_NAME);
  }

  /**
   * Run the tasks after the preparation for creating the new project
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @private
   */
  private run() {
    this.prepare_package_json.save(Name.PROJECT_PATH);
    this.prepare_CreateNewProjectFiles.run();
  }
}

export default new AnswerHandler();
