'use strict';

let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

let usernames = {};
let numUsers = 0;
io.on('connection', socket => {

  let addedUser = false;

  //send new message
  socket.on('new message', data => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  //na username ingeven
  socket.on('add user',  username => {
    //username in socket variabele steken
    socket.username = username;
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  //... is typing
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  //stop typing message
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  //user ... left
  socket.on('disconnect', () => {
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});
