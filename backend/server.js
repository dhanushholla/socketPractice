// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); 

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

let checkboxState = Array(25).fill(false);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('initialState', checkboxState);
    socket.on('toggleCheckbox', (index) => {
        if (!checkboxState[index]) {
            console.log('togglecheckbox triggered');
            checkboxState[index] = true;
            io.emit('updateCheckbox', index);
        }
    });

    socket.on('ResetBoxes',() =>{
        console.log('inset reset')
        checkboxState = Array(25).fill(false);
        io.emit('initialState', checkboxState);
    })

    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

