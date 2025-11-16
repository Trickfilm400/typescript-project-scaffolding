import * as ncu from 'npm-check-updates';

class PackageVersions {
  static STATIC_DEPENDENCY_VERSIONS: Record<string, string> = {
    '@types/node': '^22.13.14',
    '@types/convict': '^6.1.6',
    '@types/amqplib': '^0.10.8',
    '@types/jest': '^30.0.0',
    '@types/mocha': '^10.0.10',
    '@types/chai': '^5.2.3',
    '@trickfilm400/eslint-shared-config': '^0.0.1',
    '@types/mysql': '^2.15.27',
    '@kopf02/express-utils': '^2.0.0',
    '@types/express': '^5.0.5',
    typescript: '^5.9.3',
    'ts-node': '^10.9.2',
    'ts-node-dev': '^2.0.0',
    convict: '^6.2.4',
    winston: '^3.18.3',
    joi: '^18.0.1',
    mqtt: '^5.14.1',
    'amqp-connection-manager': '^5.0.0',
    amqplib: '^0.10.9',
    nyc: '^17.1.0',
    jest: '^30.2.0',
    chai: '^6.2.1',
    'chai-http': '^5.1.2',
    cypress: '^15.6.0',
    mocha: '^11.7.5',
    'mocha-junit-reporter': '^2.2.1',
    vitest: '^4.0.9',
    mongoose: '^8.19.4',
    typeorm: '^0.3.27',
    mysql: '^2.18.1',
    mysql2: '^3.15.3',
    mongodb: '^7.0.0',
    redis: '^5.9.0',
    ws: '^8.18.3',
    'socket.io': '^4.8.1',
  };
  async runNCU(jsonData: string) {
    const upgraded = await ncu.run({
      // Pass any cli option
      packageData: jsonData,
      upgrade: true,
      stdin: jsonData,
      jsonAll: true,
    });
    return upgraded;
  }
}

export default PackageVersions;
