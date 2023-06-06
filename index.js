const express =  require('express')
const http = require('http');
const socketio = require('socket.io')

const Chat = require('./models/chat');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const connect =  require('./config/databse-config');

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join_room', (data)=>{
        console.log("joining room with ", data.roomid)
        socket.join(data.roomid);
    })

    socket.on('msg_send', async (data)=>{
        console.log(data);
        const chat = await Chat.create({
            content : data.msg,
            user : data.username,
            roomId : data.roomid
        })

        io.to(data.roomid).emit('msg_rcvd', data);      // sends data to all web socket connection that exists with my web socket server
        
        
        // socket.emit('msg_rcvd', data);       // its for the same client.. other clients will not recieve those messages
        // socket.broadcast.emit('msg_rcvd', data);     // other client recieves messages but not you
    });

    socket.on('typing', (data)=>{
        socket.broadcast.to(data.roomid).emit('someone_typing')
    });

});
  
app.set('view engine', 'ejs');

app.use('/',express.static(__dirname + '/public'));

app.get('/chat/:roomid', async (req,res)=>{
    const chats = await Chat.find({
        roomId : req.params.roomid
    }).select('content user')
    res.render('index',{
        name: "richesh",
        id: req.params.roomid,
        chats: chats
    })
})

server.listen(3000, async ()=>{
    console.log("Server Started at 3000")
    await connect();
    console.log("Mongodb connected")
})