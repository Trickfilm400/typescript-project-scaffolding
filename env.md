| ENV            | default        | available options                           | description                                         |
|----------------|----------------|---------------------------------------------|-----------------------------------------------------|
| LOGLEVEL       | `info`         | ['error', 'warn', 'info', 'debug', 'silly'] | The Loglevel for the winston logger in the console  |
| NODE_ENV       | `development`  | ['production', 'development', 'test']       | Node Environment for different App behaviour        |
| PORT           | `8080`         | any port number                             | The Port the express server to listen to            |
| DB_HOST        | `localhost`    | any FQDN                                    | Database Host                                       |
| DB_PORT        | 3306 / 27017   | any port number                             | Database Port                                       |
| DB_DB          | _dynamic_      | any string                                  | Database Database                                   |
| DB_USER        | _dynamic_      | any string                                  | Database Login User                                 |
| DB_PASSWD      | _empty string_ | any password string                         | Database Login Password                             |
| REDIS_HOST     | `127.0.0.1`    | any FQDN                                    | Redis Host                                          |
| REDIS_PORT     | `6379`         | any port numbers                            | Redis Port                                          |
| REDIS_PASSWORD | `127.0.0.1`    | any password string                         | Redis Passwort                                      |
| REDIS_INDEX    | `0`            | 0-9                                         | Redis Database Index for selecting one of redis' DB |
| RABBIT_HOST    | `127.0.0.1`    | any FQDN                                    | RabbitMQ Host                                       |
| RABBIT_PORT    | `5672`         | any port numbers                            | RabbitMQ Port                                       |
