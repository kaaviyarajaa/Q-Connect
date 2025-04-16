const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

const PORT = 3000;
app.use(cors());
app.use(express.json());
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

let messages = [
  { sender: 'Alice', content: 'Hi Bob!' },
  { sender: 'Bob', content: 'Hey Alice!' }
];

app.get('/api/users', (req, res) => {
  res.json(users);
});
app.post('/api/users', (req, res) => {
  const newUser = { id: users.length + 1, name: req.body.name };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});
app.post('/api/messages', (req, res) => {
  const newMessage = { sender: req.body.sender, content: req.body.content };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', (data) => {
    console.log('Message:', data);
    messages.push(data); 
    socket.broadcast.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
