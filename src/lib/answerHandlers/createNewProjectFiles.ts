import { IPrompt } from '../../interfaces/IPrompt';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Copy the required project files to the destination folder
 * @version 1.0.0
 * @author Nico W.
 * @since 06.11.2022
 * @class
 */
export class CreateNewProjectFiles {
  private readonly answers: IPrompt;
  /**
   * Project Path (destination)
   * @private
   * @readonly
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   */
  private readonly path: string;
  /**
   * Static Files Path (source)
   * @private
   * @readonly
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   */
  private readonly staticPath: string;
  /**
   * Project Name => Folder Name (if not ".")
   * @private
   * @readonly
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   */
  private readonly projectName: string;
  constructor(answers: IPrompt, projectPath: string, projectName: string) {
    this.answers = answers;
    this.path = projectPath;
    this.projectName = projectName;
    this.staticPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'static');
  }

  /**
   * Run all functions
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   */
  run() {
    //create path if not exist
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
    //only add if Dockerfile option was selected
    if (this.answers['project-dockerfile-enabled'] && this.answers["project-type"] !== "http-api@express-utils") {
      this.addDocker();
    }
    //eslint / prettier
    this.addEslintPrettier();
    //template files
    this.copyProjectPresetFiles();
    //required npm initial project files
    this.addGenericFiles();
  }

  /**
   * Copy the required initial project files to the destination folder
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @class
   */
  protected addGenericFiles() {
    //region .idea folder
    //create
    if (this.answers['project-idea']?.length > 0 && !fs.existsSync(path.join(this.path, '.idea'))) {
      fs.mkdirSync(path.join(this.path, '.idea'));
    }
    //copy files
    if (this.answers['project-idea']?.includes('prettier')) {
      fs.copyFileSync(
        path.join(this.staticPath, 'idea', 'prettier.xml'),
        path.join(this.path, '.idea', 'prettier.xml')
      );
    }
    //create
    if (this.answers['project-idea']?.length > 0 && !fs.existsSync(path.join(this.path, '.idea', 'jsLinters'))) {
      fs.mkdirSync(path.join(this.path, '.idea', 'jsLinters'));
    }
    if (this.answers['project-idea']?.includes('eslint')) {
      fs.copyFileSync(
        path.join(this.staticPath, 'idea', 'jsLinters', 'eslint.xml'),
        path.join(this.path, '.idea', 'jsLinters', 'eslint.xml')
      );
    }
    //endregion
    //region cicd template files
    const eslint = this.answers['project-additional-dependencies'].includes('eslint');
    const testing = this.answers['project-testing-dependencies'].length > 0;
    let templateFile = 'only';
    if (testing) templateFile = 'test';
    if (eslint) templateFile = 'eslint';
    if (testing && eslint) templateFile = 'eslint_test';
    if (this.answers['project-cicd-pipeline'] !== 'none') {
      if (this.answers['project-cicd-pipeline'] === 'github')
        fs.mkdirSync(path.join(this.path, '.github', 'workflows'), { recursive: true });
      fs.copyFileSync(
        path.join(
          this.staticPath,
          'cicd',
          this.answers['project-type'] === 'npm-package' ? 'npm_package' : 'docker',
          `${this.answers['project-cicd-pipeline'] === 'github' ? 'github' : 'gitlab'}_build_${templateFile}.yml`
        ),
        this.answers['project-cicd-pipeline'] === 'github'
          ? path.join(this.path, '.github', 'workflows', 'ci.yml')
          : path.join(this.path, '.gitlab-ci.yml')
      );
    }
    //endregion
    // copy winston file (only if not http api, because there the logger is integrated already)
    if (
      this.answers['project-additional-dependencies'].includes('winston') &&
      this.answers['project-type'] !== 'http-api@express-utils'
    ) {
      fs.copyFileSync(path.join(this.staticPath, 'ts', 'logger.ts'), path.join(this.path, 'src', 'logger.ts'));
    }
    // create readme.md
    fs.writeFileSync(
      path.join(this.path, 'readme.md'),
      `# ${this.projectName}\n\n&copy; 2023\n\nCreated with ♥ by [typescript-project-scaffolding](https://github.com/Trickfilm400/typescript-project-scaffolding)`
    );
    fs.copyFileSync(path.join(this.staticPath, 'gitignore'), path.join(this.path, '.gitignore'));
    //copy a tsconfig file with declarations true if it is a npm module
    switch (this.answers['project-type']) {
      case 'npm-package':
        fs.copyFileSync(path.join(this.staticPath, 'tsconfig_npm_module.json'), path.join(this.path, 'tsconfig.json'));
        break;
      default:
        fs.copyFileSync(path.join(this.staticPath, 'tsconfig.json'), path.join(this.path, 'tsconfig.json'));
        break;
    }
  }

  /**
   * Copy the Dockerfile files (if selected) to the destination folder
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @class
   */
  protected addDocker() {
    fs.copyFileSync(path.join(this.staticPath, 'dockerignore'), path.join(this.path, '.dockerignore'));
    fs.copyFileSync(path.join(this.staticPath, 'Dockerfile'), path.join(this.path, 'Dockerfile'));
  }

  /**
   * Copy the eslint / prettier config files to the destination folder
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @class
   */
  protected addEslintPrettier() {
    if (this.answers['project-additional-dependencies'].includes('prettier')) {
      fs.copyFileSync(path.join(this.staticPath, 'prettierrc'), path.join(this.path, '.prettierrc'));
    }

    if (this.answers['project-additional-dependencies'].includes('eslint')) {
      fs.copyFileSync(path.join(this.staticPath, 'eslintrc.js'), path.join(this.path, '.eslintrc.js'));
    }
  }

  /**
   * Copy the required selected project template files to the destination folder
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @class
   */
  protected copyProjectPresetFiles() {
    switch (this.answers['project-type']) {
      case 'npm-package':
        fs.cpSync(path.join(this.staticPath, 'example_src', 'npm_package'), path.join(this.path, 'src'), {
          recursive: true,
        });
        fs.copyFileSync(path.join(this.staticPath, 'npmignore'), path.join(this.path, '.npmignore'));
        break;
      case 'http-api@express-utils':
        fs.cpSync(
          path.join(this.staticPath, 'example_src', 'express-utils-template', 'src'),
          path.join(this.path, 'src'),
          { recursive: true }
        );
        fs.cpSync(
          path.join(this.staticPath, 'example_src', 'express-utils-template', 'test'),
          path.join(this.path, 'test'),
          { recursive: true }
        );
        fs.cpSync(
          path.join(this.staticPath, 'example_src', 'express-utils-template', 'Dockerfile'),
          path.join(this.path, 'Dockerfile'),
          { recursive: true }
        );
        break;
      case 'empty-project':
        fs.cpSync(path.join(this.staticPath, 'example_src', 'empty_project'), path.join(this.path, 'src'), {
          recursive: true,
        });
        break;
      case 'socket-io-server':
        fs.cpSync(path.join(this.staticPath, 'example_src', 'socket_io_server'), path.join(this.path, 'src'), {
          recursive: true,
        });
        break;
      case 'websocket-server':
        fs.cpSync(path.join(this.staticPath, 'example_src', 'websocket_server'), path.join(this.path, 'src'), {
          recursive: true,
        });
        break;
    }
  }
}
