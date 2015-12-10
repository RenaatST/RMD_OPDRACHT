'use strict';


let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let users = [];
let port = process.env.PORT || 8080;
let secret = 'test';

app.use(express.static(__dirname + '/public'));


let socketid;

io.on('connection', socket => {

  socket.emit("socketid", socket.id);
  socketid = socket.id;

  // socket.on('load', data => {
  //   socket.emit('access', {
  //     access: (data.key === secret ? "granted" : "denied")
  //   });

  // });
  socket.on('knopgedrukt', data => {
    console.log("op de knop gedrukt -- SERVER");
    //socket.emit('drisgedrukt', socketid);
    socket.broadcast.emit('drisgedrukt', socketid);
  });

  // //na username ingeven
  // socket.on('add user',  username => {

  //   socket.broadcast.emit('login', {
  //     socketid: socketid
  //   });

  //   let maxID = 0;

  //   if(users.length > 0){
  //     users.forEach(user => {
  //       if(user.id > maxID){
  //         maxID = user.id;
  //       }
  //     });
  //   }

  //   let user = new User(maxID + 1, socket.id, username);
  //   users.push(user);
  //   console.log(users);
  //   socket.emit('userjoined', user);

  // });


  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', socketid);
    users = users.filter(c => c.socketid !== socket.id);
    console.log(users);
  });


});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});
