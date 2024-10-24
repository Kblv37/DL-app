const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const transfers = {};

wss.on('connection', function connection(ws, req) {
  const transferCode = new URL(req.url, 'http://localhost').searchParams.get('code');
  
  if (!transfers[transferCode]) {
    transfers[transferCode] = ws;
  } else {
    // Принимаем файл и отправляем на клиента
    transfers[transferCode].on('message', function incoming(data) {
      ws.send(data);
    });
  }
});
