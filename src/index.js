import express from 'express';
import { matchRouter } from './routes/matches.js';
import { attachWebSocketServer } from './websocket.js';
import http from 'http';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
}); 

app.use('/matches', matchRouter);

const { broadcastMatchCreated } =  attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running at ${baseUrl}`);
  console.log(`WebSocket server is running at ${baseUrl.replace('http', 'ws')}/ws`);
});
