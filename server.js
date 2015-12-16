'use strict';

let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let Client = require('./models/Client');

let port = process.env.PORT || 3000;
let loginWord = "woord1";
let loginWord2 = "woord2";

let clients = [];
let socketid;
let arrayMetKeys = [];

let firstSocketId;
let secondSocketId;

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
  socketid = socket.id;

  socket.emit("socketid",socket.id);

  socket.on('yPosDown', (playerposY, playerId) => {
    socket.broadcast.emit('yPosupdateDown', playerposY, playerId);
  });

  socket.on('yPosUp', (playerposY, playerId) => {
    socket.broadcast.emit('yPosupdate', playerposY, playerId);
  });

  socket.on('ditIsDesktopSocket', (key, socketidDesktop) => {
    loginWord = key;
    secondSocketId = socketidDesktop;

    //arrayMetKeys.push(key);
    arrayMetKeys.push({id: secondSocketId, key: loginWord});
  });

  socket.on('ditIsMobileSocket', (key, socketidMobile) => {
    firstSocketId = socketidMobile;

    if (arrayMetKeys !== []) {
      arrayMetKeys.forEach(function(code) {
        if (code.key === key){
          console.log("dit is mobile met id " + firstSocketId + " and connected to desktop id " + secondSocketId);

          let client  = new Client(firstSocketId, secondSocketId, randomColor());
          socket.broadcast.emit('newplayer', client);
          io.to(secondSocketId).emit('thisIsANewSpeler', client);

          console.log("all keys before " + arrayMetKeys);
          arrayMetKeys.splice(arrayMetKeys.indexOf(code), 1);
          console.log("all keys " + arrayMetKeys);

        }else{
          console.log(key + " je zit verkeerd");
        }
      });
    }

  });





  socket.on('movePlayerUp', player => {
    socket.broadcast.emit('thisPlayerUp', player);


  });

  socket.on('disconnect', () => {
    clients = clients.filter(c => c.socketid !== socket.id);
    socket.broadcast.emit('removePlayer', socket.id);

  });


});


const randomColor = () => {

  let letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;

};

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

