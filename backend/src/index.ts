import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import apiRouter from './routes/api';
import { startOrchestrator } from './orchestrator';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());
app.use('/api', apiRouter);

io.on('connection', (socket) => {
  console.log(`[RASTA] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[RASTA] Client disconnected: ${socket.id}`);
  });

  socket.on('node:command', (data) => {
    console.log(`[RASTA] Node command received:`, data);
    io.emit('node:command:ack', { ...data, ack: true, timestamp: Date.now() });
  });
});

startOrchestrator(io);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 RASTA Cortex Backend running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready`);
  console.log(`🤖 AI Orchestrator active\n`);
});
