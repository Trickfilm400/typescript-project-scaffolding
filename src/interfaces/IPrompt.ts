/**
 * Interface for inquirer prompt answers
 * @version 1.0.0
 * @interface
 * @author Nico W.
 * @since 01.11.2022
 */
export interface IPrompt {
  /**
   * Project Name (used in package.json, as folder path,. in readme)
   * @version 1.0.0
   * @author Nico W.
   * @since 01.11.2022
   */
  'project-name': string;
  /**
   * List of possible pre-select-able templates to create a project with
   * Each option has custom template files for faster startup times for new projects
   * @version 1.0.0
   * @author Nico W.
   * @since 01.11.2022
   */
  'project-type': 'http-api@express-utils' | 'websocket-server' | 'socket-io-server' | 'npm-package' | 'empty-project';
  /**
   * Whether a Dockerfile will be added to the template (only asked if not a npm-package)
   * @version 1.0.0
   * @author Nico W.
   * @since 01.11.2022
   */
  'project-dockerfile-enabled': boolean;
  /**
   * Select a CI/CD Template for the remote Git Repository Type
   * The Pipeline will have auto generated steps created by the user selected questions for minimal manual changes
   * @version 1.0.0
   * @author Nico W.
   * @since 01.11.2022
   */
  'project-cicd-pipeline': 'gitlab' | 'github' | 'none';
  /**
   * Additional Dependencies for the project, select what you want
   * @version 1.0.0
   * @author Nico W.
   * @since 01.11.2022
   */
  'project-additional-dependencies': ('eslint' | 'prettier' | 'convict' | 'ts-node-dev' | 'winston' | 'joi')[];
  /**
   * If testing should be added (unit tests, integration tests, e2e-tests or so)
   * Example Test files will be added
   * @version 1.0.0
   * @author Nico W.
   * @since 01.11.2022
   */
  'project-testing-enabled': boolean;
  /**
   * Select you testing frameworks for writing and executing your tests
   * @version 1.0.0
   * @author Nico W.
   * @since 01.11.2022
   */
  'project-testing-dependencies': ('mocha' | 'chai-http' | 'nyc' | 'cypress' | 'jest' | 'vitest')[];
  /**
   * Select your Database Driver for your project
   * @version 1.0.0
   * @author Nico W.
   * @since 01.11.2022
   */
  'project-database-driver': ('mongoose' | 'typeorm' | 'mysql' | 'mysql2' | 'mongodb' | 'redis' | 'none')[];
}
