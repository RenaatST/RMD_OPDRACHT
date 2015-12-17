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

let mobileSocketIdInServer;
let desktopSocketIdInServer;

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
  socketid = socket.id;

  console.log(arrayMetKeys);

  socket.emit("socketid",socket.id);

  socket.on('yPosDown', (playerposY, playerId) => {
    socket.broadcast.emit('yPosupdateDown', playerposY, playerId);
  });

  socket.on('yPosUp', (playerposY, playerId) => {
    socket.broadcast.emit('yPosupdate', playerposY, playerId);
  });

  socket.on('downhillFast', socketidDownhill => {
    //console.log(socketidDownhill);
    io.sockets.emit('downHill', socketidDownhill);
  });

  socket.on('disturb', sockIdDisturb => {
    //console.log(socketidDownhill);
    io.sockets.emit('disturbToAll', sockIdDisturb);
  });

  socket.on('changecolor', sockIdColor => {
    //console.log(socketidDownhill);
    io.sockets.emit('changecolorToAll', sockIdColor);
  });

  socket.on('shuffle', sockIdShuffle => {
    //console.log(socketidDownhill);
    io.sockets.emit('shuffleToAll', sockIdShuffle);
  });


  socket.on('ditIsDesktopSocket', (key, socketidDesktop) => {
    loginWord = key;
    desktopSocketIdInServer = socketidDesktop;

    //arrayMetKeys.push(key);
    arrayMetKeys.push({id: desktopSocketIdInServer, key: loginWord});
  });

  socket.on('ditIsMobileSocket', (key, socketidMobile) => {
    mobileSocketIdInServer = socketidMobile;

    if (arrayMetKeys !== []) {
      arrayMetKeys.forEach(function(code) {
        if (code.key === key){
          socket.emit("schermwegdoen");
          console.log("dit is mobile met id " + mobileSocketIdInServer + " and connected to desktop id " + code.id);

          let client  = new Client(mobileSocketIdInServer, code.id, randomColor());

          socket.broadcast.to(code.id).emit('thisIsANewSpeler', client);
          console.log("client to yourself " + client.socketidMobile);

          arrayMetKeys.splice(arrayMetKeys.indexOf(code), 1);

          console.log("client to everyone " + client.socketidMobile);
          console.log("desktop to everyone " + client.socketidDesktop);

          io.sockets.emit('newplayer', client);


        }else{
          console.log(key + " je zit verkeerd");
        }
      });
    }

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

