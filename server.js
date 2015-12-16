'use strict';

let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
var Client = require('./models/Client');

let port = process.env.PORT || 3000;
let loginWord = "kaka";
let loginWord2 = "pipi";

let clients = [];
let socketid;

let firstSocketId;
let secondSocketId;

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
  socketid = socket.id;

  socket.emit("socketid",socket.id);


  socket.on('ditIsMobileSocket', (key, socketidMobile) => {

    loginWord2 = key;
    firstSocketId = socketidMobile;

    if(loginWord === loginWord2){
      console.log("dit is mobile met id " + firstSocketId + " and connected to desktop id " + secondSocketId);
      let client  = new Client(firstSocketId, secondSocketId, 'red');
      //socket.emit('thisIsANewSpeler', client);
      io.to(secondSocketId).emit('thisIsANewSpeler', client);
      socket.broadcast.emit('newplayer', client);
      //clients.push(client);
    };

    //console.log(firstSocketId);
  });

  socket.on('ditIsDesktopSocket', (key, socketidDesktop) => {

    loginWord = key;
    secondSocketId = socketidDesktop;
    //console.log(firstSocketId);
  });





  socket.on('movePlayerUp', player => {
    io.emit('thisPlayerUp', player);

    console.log('updat this player server');
  });

  socket.on('disconnect', () => {
    clients = clients.filter(c => c.socketid !== socket.id);
    socket.broadcast.emit('removePlayer', socket.id);

  });


});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

