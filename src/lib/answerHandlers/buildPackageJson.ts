import { PackageJson } from 'type-fest';
import { IPrompt } from '../../interfaces/IPrompt';
import * as fs from 'fs';
import * as path from 'path';
import PackageVersions from './packageVersions.js';

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
  private packageVersionClass: PackageVersions;

  constructor(name: string, answers: IPrompt) {
    this.packageVersionClass = new PackageVersions();
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

  private depVer(name: string) {
    return PackageVersions.STATIC_DEPENDENCY_VERSIONS[name] || 'latest';
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
    //if testing packages are selected
    if (this.answers['project-testing-dependencies']?.length > 0) {
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
    if (this.answers['project-additional-dependencies'].includes('eslint')) testObj['eslint'] = 'eslint src/**/*.ts';
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
    this.json['devDependencies']['typescript'] = this.depVer('typescript');
    this.json['devDependencies']['@types/node'] = this.depVer('@types/node');

    //region ADDITIONAL_DEPENDENCIES
    if (this.answers['project-additional-dependencies'].includes('convict')) {
      this.json['dependencies']['convict'] = this.depVer('convict');
      this.json['devDependencies']['@types/convict'] = this.depVer('@types/convict');
    }
    if (this.answers['project-additional-dependencies'].includes('eslint')) {
      this.json['devDependencies']['eslint'] = this.depVer('eslint');
    }
    if (this.answers['project-additional-dependencies'].includes('prettier')) {
      this.json['devDependencies']['@typescript-eslint/eslint-plugin'] = this.depVer(
        '@typescript-eslint/eslint-plugin'
      );
      this.json['devDependencies']['@typescript-eslint/parser'] = this.depVer('@typescript-eslint/parser');
      this.json['devDependencies']['eslint-plugin-prettier'] = this.depVer('eslint-plugin-prettier');
    }
    if (this.answers['project-additional-dependencies'].includes('ts-node-dev')) {
      this.json['devDependencies']['ts-node'] = this.depVer('ts-node');
      this.json['devDependencies']['ts-node-dev'] = this.depVer('ts-node-dev');
    }
    if (this.answers['project-additional-dependencies'].includes('winston')) {
      this.json['dependencies']['winston'] = this.depVer('winston');
    }
    if (this.answers['project-additional-dependencies'].includes('joi')) {
      this.json['dependencies']['joi'] = this.depVer('joi');
    }
    if (this.answers['project-additional-dependencies'].includes('mqtt')) {
      this.json['dependencies']['mqtt'] = this.depVer('mqtt');
    }
    if (this.answers['project-additional-dependencies'].includes('amqp')) {
      this.json['dependencies']['amqp-connection-manager'] = this.depVer('amqp-connection-manager');
      this.json['dependencies']['amqplib'] = this.depVer('amqplib');
      this.json['devDependencies']['@types/amqplib'] = this.depVer('@types/amqplib');
    }
    //endregion
    //region TESTING_DEPENDENCIES
    if (this.answers['project-testing-dependencies']?.includes('nyc')) {
      this.json['devDependencies']['nyc'] = this.depVer('nyc');
    }
    if (this.answers['project-testing-dependencies']?.includes('jest')) {
      this.json['devDependencies']['jest'] = this.depVer('jest');
    }
    if (this.answers['project-testing-dependencies']?.includes('chai-http')) {
      this.json['devDependencies']['chai'] = this.depVer('chai');
      this.json['devDependencies']['chai-http'] = this.depVer('chai-http');
    }
    if (this.answers['project-testing-dependencies']?.includes('cypress')) {
      this.json['devDependencies']['cypress'] = this.depVer('cypress');
    }
    if (this.answers['project-testing-dependencies']?.includes('mocha')) {
      this.json['devDependencies']['mocha'] = this.depVer('mocha');
      this.json['devDependencies']['@types/mocha'] = this.depVer('@types/mocha');
      if (this.answers['project-cicd-pipeline'] == 'gitlab')
        this.json['devDependencies']['mocha-junit-reporter'] = this.depVer('mocha-junit-reporter');
    }
    if (this.answers['project-testing-dependencies']?.includes('vitest')) {
      this.json['devDependencies']['vitest'] = this.depVer('vitest');
    }
    //endregion
    //region DATABASE_DRIVER
    if (this.answers['project-database-driver'].includes('mongoose')) {
      this.json['dependencies']['mongoose'] = this.depVer('mongoose');
    }
    if (this.answers['project-database-driver'].includes('typeorm')) {
      this.json['dependencies']['typeorm'] = this.depVer('typeorm');
    }
    if (this.answers['project-database-driver'].includes('mysql')) {
      this.json['dependencies']['mysql'] = this.depVer('mysql');
      this.json['devDependencies']['@types/mysql'] = this.depVer('@types/mysql');
    }
    if (this.answers['project-database-driver'].includes('mysql2')) {
      this.json['dependencies']['mysql2'] = this.depVer('mysql2');
    }
    if (this.answers['project-database-driver'].includes('mongodb')) {
      this.json['dependencies']['mongodb'] = this.depVer('mongodb');
    }
    if (this.answers['project-database-driver'].includes('redis')) {
      this.json['dependencies']['redis'] = this.depVer('redis');
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
      this.json['dependencies']['@kopf02/express-utils'] = this.depVer('@kopf02/express-utils');
      this.json['dependencies']['@types/express'] = this.depVer('@types/express');
    }
    if (this.answers['project-type'] == 'websocket-server') {
      this.json['dependencies']['ws'] = this.depVer('ws');
    }
    if (this.answers['project-type'] == 'socket-io-server') {
      this.json['dependencies']['socket.io'] = this.depVer('socket.io');
    }
  }

  private additional() {
    if (this.answers['project-type'] === 'npm-package') {
      this.json.files = ['dist', 'typings'];
      this.json.typing = 'types/index.d.ts';
    }
  }

  public fetchLatestPackageVersions() {
    return new Promise((resolve, reject) => {
      this.packageVersionClass
        .runNCU(JSON.stringify(this.json))
        .then((res) => {
          this.json = res as PackageJson;
          resolve(void 0);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  public save(filePath: string) {
    //create path if not exist
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
    fs.writeFileSync(path.join(filePath, 'package.json'), JSON.stringify(this.json, null, 4));
  }
}
