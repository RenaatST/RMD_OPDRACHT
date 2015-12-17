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
  socket.emit("socketid",socket.id);

  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  //////////////////////////UPDATES PLAYERS///////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////



  socket.on('particles', (playerX, playerY, playerID, desktopID) => {
    // console.log('player ' + playerID);
    // console.log('player sends particles x ' + playerX);
    // console.log('player sends particles x ' + playerY);
    socket.broadcast.emit('sendParticlesToEveryone', playerX, playerY, playerID, desktopID);
  });


  socket.on('yPosDown', (playerposY, playerId) => {
    //console.log('dooooown' + playerposY + ' player id: ' + playerId);
    socket.broadcast.emit('yPosDownAllPlayers', playerposY, playerId);
  });

  socket.on('yPosUp', (playerposY, playerId) => {
    //console.log('uuuup' + playerposY + ' player id: ' + playerId);
    socket.broadcast.emit('yPosUpAllPlayers', playerposY, playerId);
  });


  socket.on('gameover', playerId => {
    console.log('Game Over' + playerId);
    //socket.broadcast.emit('gameoverplayer', playerId);
    socket.broadcast.to(playerId).emit('gameoverplayer', playerId);
  });


  ////////////////////////////////////////////////////////////////////
  //////////////////////////////BUTTONS///////////////////////////////
  ////////////////////////////////////////////////////////////////////


  socket.on('downhillFast', (socketidDownhill, socketIdDesktopDownHill) => {
    io.sockets.emit('downHill', socketidDownhill, socketIdDesktopDownHill);
  });

  socket.on('disturb', (sockIdDisturb, socketDesktopID) => {
    //console.log(socketidDownhill);
    io.sockets.emit('disturbToAll', sockIdDisturb, socketDesktopID);
  });

  socket.on('flipview', (sockIdChangeView, socketDesktopID) => {
    //console.log(socketidDownhill);
    io.sockets.emit('changeCameraViewToAll', sockIdChangeView, socketDesktopID);
  });

  socket.on('shuffle', sockIdShuffle => {
    //console.log(socketidDownhill);
    io.sockets.emit('shuffleToAll', sockIdShuffle);
  });


  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////DESKTOP OF MOBILE///////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////

  socket.on('ditIsDesktopSocket', (key, socketidDesktop) => {
    loginWord = key;
    desktopSocketIdInServer = socketidDesktop;

    //arrayMetKeys.push(key);
    arrayMetKeys.push({id: desktopSocketIdInServer, key: loginWord});
  });

  socket.on('ditIsMobileSocket', (key, socketidMobile, color) => {
    mobileSocketIdInServer = socketidMobile;

    if (arrayMetKeys !== []) {
      arrayMetKeys.forEach(function(code) {
        if (code.key === key){


          console.log("dit is mobile met id " + mobileSocketIdInServer + " and connected to desktop id " + code.id);
          socket.emit("schermwegdoen", code.id);
          let client  = new Client(mobileSocketIdInServer, code.id, color);

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


  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ///////////////////////////Disconnect///////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////


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

