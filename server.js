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
