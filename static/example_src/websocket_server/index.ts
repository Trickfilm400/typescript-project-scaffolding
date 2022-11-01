console.log('Start...');

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 8080,
  host: '0.0.0.0',
  perMessageDeflate: true,
});

wss.on('connection', function connection(ws) {
  console.log(ws);

  ws.on('message', function message(data) {
    console.log(Date.now(), 'received: %s', data.toString());
  });

  ws.send(JSON.stringify({ server: 'say Hi' }));
});
