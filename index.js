const express =  require('express')
const http = require('http');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('msg_send', (data)=>{
        console.log(data);
        io.emit('msg_rcvd', data);      // sends data to all web socket connection that exists with my web socket server
        // socket.emit('msg_rcvd', data);       // its for the same client.. other clients will not recieve those messages
        // socket.broadcast.emit('msg_rcvd', data);     // other client recieves messages but not you
    })

});
  


app.use('/',express.static(__dirname + '/public'));

server.listen(3000, ()=>{
    console.log("Server Started at 3000")
})