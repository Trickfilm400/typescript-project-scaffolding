import * as io from 'socket.io';

console.log('Start...');

export interface ClientToServerEvents {
  eventName: (params: any) => void;
}

interface ServerToClientEvents {
  eventName: (params: any) => void;
}

class SocketServer {
  private io: io.Server<ClientToServerEvents, ServerToClientEvents>;

  constructor() {
    this.io = new io.Server(undefined, { cors: { origin: '*' } });
    this.io.on('connection', (socket) => this.onConnection(socket));
  }

  private async onConnection(socket: io.Socket<ClientToServerEvents, ServerToClientEvents>) {
    console.log('New Socket Connection from', socket.handshake.address);
    //templates
    socket.on('eventName', (_params: any) => {});
  }

  public listen(port = 8080) {
    this.io.listen(port);
    console.log(`[ ${process.uptime()} ] - Socket Server listening...`);
  }
}

new SocketServer().listen();
