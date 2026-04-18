import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3000, path: '/orders' });

const sampleOrders = [
  { id: 101, userId: 1, symbol: 'AAPL', side: 'BUY', qty: 10, status: 'OPEN' },
  { id: 102, userId: 2, symbol: 'TSLA', side: 'SELL', qty: 5, status: 'FILLED' }
];

console.log('Mock WS running at ws://localhost:3000/orders');

wss.on('connection', (socket) => {
  console.log('Client connected to mock orders socket');

  let index = 0;
  const timer = setInterval(() => {
    const payload = sampleOrders[index % sampleOrders.length];
    socket.send(JSON.stringify({ type: 'order-update', payload }));
    index += 1;
  }, 3000);

  socket.on('close', () => {
    clearInterval(timer);
    console.log('Client disconnected from mock orders socket');
  });
});
