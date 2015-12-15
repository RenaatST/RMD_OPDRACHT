'use strict';

let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
var Client = require('./models/Client');

let port = process.env.PORT || 3000;

let clients = [];
let socketid;

app.use(express.static(__dirname + '/public'));



io.on('connection', socket => {
  socketid = socket.id;
  socket.emit("socketid",socket.id);

  /*socket.on('new_user', newUserSocketId => {

    console.log("client login: " + newUserSocketId);

    var client  = new Client(socketid);
    clients.push(client);
    console.log(clients);
    socket.broadcast.emit('add_new_user', client);
  });*/

  socket.on('startgame', data => {

    let client  = new Client(data.socketid, data.color);
    socket.broadcast.emit('thisIsANewSpeler', client);

    clients.push(client);
    console.log(clients);

  });

  socket.on('disconnect', () => {
    console.log('client logout ' + socket.id);
    socket.broadcast.emit('deleteplayer', socketid);

    clients = clients.filter(c => c.socketid !== socket.id);
  });

});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

