import * as ncu from 'npm-check-updates';

class PackageVersions {
  static STATIC_DEPENDENCY_VERSIONS: Record<string, string> = {
    '@types/node': '18.11.9',
    '@types/convict': '6.1.1',
    '@types/amqplib': '0.8.2',
    '@types/jest': '27.0.3',
    '@types/mocha': '10.0.0',
    '@types/chai': '4.2.21',
    '@types/chai-http': '4.3.11',
    '@types/cypress': '9.0.0',
    '@typescript-eslint/eslint-plugin': '5.42.1',
    '@typescript-eslint/parser': '5.42.1',
    '@types/mysql': '2.15.21',
    '@kopf02/express-utils': '1.2.8-main-465bfb20780902c28428aa7a1b4a1fbc4cb38911.0',
    '@types/express': '4.17.14',
    typescript: '4.8.4',
    'ts-node': '10.9.1',
    'ts-node-dev': '2.0.0',
    convict: '6.2.3',
    eslint: '8.27.0',
    'eslint-plugin-prettier': '4.2.1',
    winston: '3.8.2',
    joi: '17.7.0',
    mqtt: '4.3.7',
    'amqp-connection-manager': '4.2.0',
    amqplib: '0.10.3',
    nyc: '15.1.0',
    jest: '29.3.1',
    chai: '4.3.7',
    'chai-http': '4.3.0',
    cypress: '11.0.1',
    mocha: '10.1.0',
    'mocha-junit-reporter': '2.0.0',
    vitest: '0.25.1',
    mongoose: '6.7.2',
    typeorm: '0.3.10',
    mysql: '2.18.1',
    mysql2: '2.3.3',
    mongodb: '4.11.0',
    redis: '4.5.0',
    ws: '8.11.0',
    'socket.io': '4.5.3',
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
