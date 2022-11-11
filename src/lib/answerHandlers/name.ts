import * as path from 'path';

/**
 * Get the Project Name and Project path where to create the new project files
 * @version 1.0.0
 * @author Nico W.
 * @since 01.11.2022
 * @class
 */
export default class Name {
  /**
   * Fodler Path where to create the new files
   */
  static PROJECT_PATH = '';
  /**
   * Name of the project (like the folder-name if "." given or the given string)
   */
  static PROJECT_NAME = '';
  constructor(givenProjectString: string) {
    if (givenProjectString === '.') {
      Name.PROJECT_PATH = process.cwd();
      Name.PROJECT_NAME = path.basename(process.cwd());
    } else {
      Name.PROJECT_PATH = path.join(process.cwd(), givenProjectString);
      Name.PROJECT_NAME = givenProjectString;
    }
  }

  static validatePackageName(input: string) {
    return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(input);
  }
}
