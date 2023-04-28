import * as path from 'path';
import * as fs from 'fs';

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
    if (givenProjectString === '.' || givenProjectString === '') {
      Name.PROJECT_PATH = process.cwd();
      Name.PROJECT_NAME = path.basename(process.cwd());
    } else {
      Name.PROJECT_PATH = path.join(process.cwd(), givenProjectString);
      Name.PROJECT_NAME = givenProjectString;
    }
  }

  static VALIDATE_RETRY = 0;

  static validate(input: string) {
    let isValidPathInput = Name.validatePackageName(input);
    if (!isValidPathInput && input === '.') isValidPathInput = true;
    if (fs.existsSync(path.join(process.cwd(), input)) && fs.readdirSync(path.join(process.cwd(), input)).length > 0) {
      this.VALIDATE_RETRY++;
      if (this.VALIDATE_RETRY > 3) {
        this.VALIDATE_RETRY = 0;
        return true;
      }
      return `The given path is not empty (Press Enter ${
        3 - this.VALIDATE_RETRY
      } times again to force-use this folder)`;
    } else this.VALIDATE_RETRY = 0;
    return isValidPathInput ? true : "Please enter '.' for the current directory or a folder name like 'new-project'";
  }

  static validatePackageName(input: string) {
    return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(input);
  }
}
