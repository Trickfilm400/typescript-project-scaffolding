import { PackageJson } from 'type-fest';
import { IPrompt } from '../../interfaces/IPrompt';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Class to build up the json object for a package.json file with the selected dependencies and these requirements
 * (like custom testing scripts)
 * @version 1.0.0
 * @author Nico W.
 * @since 06.11.2022
 * @class
 */
export default class BuildPackageJson {
  private readonly answers: IPrompt;
  private readonly name: string;
  private json: PackageJson = {};

  constructor(name: string, answers: IPrompt) {
    this.name = name;
    this.answers = answers;
    this.addDefaultParameter();
    this.addDependencies();
    this.addProjectDependencies();
    this.additional();
  }

  getPackageJson() {
    return this.json;
  }

  /**
   * Add custom testing scripts to the package.json object
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @private
   */
  private getScripts(): Record<string, string> {
    const testObj: Record<string, string> = {};
    if (this.answers['project-testing-enabled']) {
      if (this.answers['project-testing-dependencies'].includes('mocha'))
        testObj['test:unit'] = 'mocha --exit -r ts-node/register test/*.ts';
      else if (this.answers['project-testing-dependencies'].includes('jest')) testObj['test:unit'] = 'jest test/*.ts';
      if (
        this.answers['project-testing-dependencies'].includes('nyc') &&
        this.answers['project-testing-dependencies'].includes('mocha')
      )
        testObj['test:coverage'] =
          'nyc --reporter cobertura --reporter=html --reporter=text mocha -r ts-node/register --require source-map-support/register --recursive test/*.ts --reporter mocha-junit-reporter --reporter=spec';
      else if (
        this.answers['project-testing-dependencies'].includes('nyc') &&
        this.answers['project-testing-dependencies'].includes('jest')
      )
        testObj['test:coverage'] = 'nyc --reporter cobertura --reporter=html --reporter=text jest --reporter=spec';
      //add final npm test script
      if (testObj['test:unit']) testObj['test'] = 'npm run test:unit';
      if (testObj['test:coverage']) {
        if (testObj['test']) testObj['test'] += ' && npm run test:coverage';
        else testObj['test'] += 'npm run test:coverage';
      } else testObj['test'] = 'echo "Error: no test specified" && exit 1';
    }
    if (this.answers['project-additional-dependencies'].includes('ts-node-dev'))
      testObj['dev'] = 'ts-node-dev --respawn --no-deps --rs --cls ./src/index.ts';
    return {
      start: 'node .',
      build: 'tsc',
      ...testObj,
    };
  }

  /**
   * Initial JSON object with default fields
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @private
   */
  private addDefaultParameter() {
    this.json = {
      name: this.name,
      version: '0.0.0-dev-01',
      description: this.name,
      main: './dist/index.js',
      scripts: this.getScripts(),
      keywords: [
        this.name,
        'created-with-typescript-new-project-scaffolding',
        'template',
        'typescript',
        'node',
        'nodejs',
      ],
      author: {
        email: 'info@example.com',
        name: 'Change me',
      },
      license: 'MIT',
      devDependencies: {},
      dependencies: {},
    };
  }

  /**
   * Add the selected dependencies to the package.json object
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @private
   */
  private addDependencies() {
    //create obj if not existed
    if (!this.json['devDependencies']) this.json['devDependencies'] = {};
    if (!this.json['dependencies']) this.json['dependencies'] = {};
    //ADD ALWAYS
    this.json['devDependencies']['typescript'] = '@latest';
    this.json['devDependencies']['@types/node'] = '@latest';

    //region ADDITIONAL_DEPENDENCIES
    if (this.answers['project-additional-dependencies'].includes('convict')) {
      this.json['dependencies']['convict'] = '@latest';
      this.json['devDependencies']['@types/convict'] = '@latest';
    }
    if (this.answers['project-additional-dependencies'].includes('eslint')) {
      this.json['devDependencies']['eslint'] = '@latest';
    }
    if (this.answers['project-additional-dependencies'].includes('prettier')) {
      this.json['devDependencies']['@typescript-eslint/eslint-plugin'] = '@latest';
      this.json['devDependencies']['@typescript-eslint/parser'] = '@latest';
      this.json['devDependencies']['eslint-plugin-prettier'] = '@latest';
    }
    if (this.answers['project-additional-dependencies'].includes('ts-node-dev')) {
      this.json['devDependencies']['ts-node'] = '@latest';
      this.json['devDependencies']['ts-node-dev'] = '@latest';
    }
    if (this.answers['project-additional-dependencies'].includes('winston')) {
      this.json['dependencies']['winston'] = '@latest';
    }
    if (this.answers['project-additional-dependencies'].includes('joi')) {
      this.json['dependencies']['joi'] = '@latest';
    }
    if (this.answers['project-additional-dependencies'].includes('mqtt')) {
      this.json['dependencies']['mqtt'] = '@latest';
    }
    if (this.answers['project-additional-dependencies'].includes('amqp')) {
      this.json['dependencies']['amqp-connection-manager'] = '@latest';
      this.json['dependencies']['amqplib'] = '@latest';
      this.json['devDependencies']['@types/amqplib'] = '@latest';
    }
    //endregion
    //region TESTING_DEPENDENCIES
    if (this.answers['project-testing-dependencies'].includes('nyc')) {
      this.json['devDependencies']['nyc'] = '@latest';
    }
    if (this.answers['project-testing-dependencies'].includes('jest')) {
      this.json['devDependencies']['jest'] = '@latest';
    }
    if (this.answers['project-testing-dependencies'].includes('chai-http')) {
      this.json['devDependencies']['chai'] = '@latest';
      this.json['devDependencies']['chai-http'] = '@latest';
    }
    if (this.answers['project-testing-dependencies'].includes('cypress')) {
      this.json['devDependencies']['cypress'] = '@latest';
    }
    if (this.answers['project-testing-dependencies'].includes('mocha')) {
      this.json['devDependencies']['mocha'] = '@latest';
      this.json['devDependencies']['@types/mocha'] = '@latest';
      if (this.answers['project-cicd-pipeline'] == 'gitlab')
        this.json['devDependencies']['mocha-junit-reporter'] = '@latest';
    }
    if (this.answers['project-testing-dependencies'].includes('vitest')) {
      this.json['devDependencies']['vitest'] = '@latest';
    }
    //endregion
    //region DATABASE_DRIVER
    if (this.answers['project-database-driver'].includes('mongoose')) {
      this.json['dependencies']['mongoose'] = '@latest';
    }
    if (this.answers['project-database-driver'].includes('typeorm')) {
      this.json['dependencies']['typeorm'] = '@latest';
    }
    if (this.answers['project-database-driver'].includes('mysql')) {
      this.json['dependencies']['mysql'] = '@latest';
      this.json['devDependencies']['@types/mysql'] = '@latest';
    }
    if (this.answers['project-database-driver'].includes('mysql2')) {
      this.json['dependencies']['mysql2'] = '@latest';
    }
    if (this.answers['project-database-driver'].includes('mongodb')) {
      this.json['dependencies']['mongodb'] = '@latest';
    }
    if (this.answers['project-database-driver'].includes('redis')) {
      this.json['dependencies']['redis'] = '@latest';
    }
    //endregion
  }

  /**
   * Add the selected dependencies of the template preset to the object
   * @version 1.0.0
   * @author Nico W.
   * @since 06.11.2022
   * @private
   */
  private addProjectDependencies() {
    //create obj if not existed
    if (!this.json['devDependencies']) this.json['devDependencies'] = {};
    if (!this.json['dependencies']) this.json['dependencies'] = {};
    //
    if (this.answers['project-type'] == 'http-api@express-utils') {
      this.json['dependencies']['@kopf02/express-utils'] = '@latest';
      this.json['dependencies']['@types/express'] = '@latest';
    }
    if (this.answers['project-type'] == 'websocket-server') {
      this.json['dependencies']['ws'] = '@latest';
    }
    if (this.answers['project-type'] == 'socket-io-server') {
      this.json['dependencies']['socket.io'] = '@latest';
    }
  }

  private additional() {
    if (this.answers['project-type'] === 'npm-package') {
      this.json.files = ['dist', 'typings'];
      this.json.typing = 'types/index.d.ts';
    }
  }
  public save(filePath: string) {
    fs.writeFileSync(path.join(filePath, 'package.json'), JSON.stringify(this.json, null, 4));
  }
}
