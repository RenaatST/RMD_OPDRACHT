'use strict';

let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let clients = [];
let port = process.env.PORT || 8080;
let secret = 'test';
var Client = require('./models/Client');


app.use(express.static(__dirname + '/public'));


let socketid;

io.on('connection', socket => {
  var maxid = 0;
  socket.emit("socketid", socket.id);
  socketid = socket.id;

  // socket.on('load', data => {
  //   socket.emit('access', {
  //     access: (data.key === secret ? "granted" : "denied")
  //   });

  // });
  socket.on('new_user', newUserSocketId => {
    console.log("Er is een nieuwe user die start game drukt");

    /*if(clients.length > 0){
      maxid = _.max(clients,function(client){
        return client.id;
      }).id;
    }*/
    var client  = new Client(maxid + 1,socketid);
    clients.push(client);
    socket.broadcast.emit('add_new_user', client);
  });


  socket.on('boost', data => {
    console.log("boost");
    //socket.emit('drisgedrukt', socketid);
    socket.broadcast.emit('goboost', socketid);
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
    clients = clients.filter(c => c.socketid !== socket.id);
    console.log(clients);
  });


});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});
