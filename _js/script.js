'use strict';

import {MathUtil} from './modules/util/';
import BlueGate from './modules/render/BlueGate';
import RedGate from './modules/render/RedGate';
import Player from './modules/render/Player';
// import {html} from './helpers/util';

let initialized = false;
let socketid;
let socket = io();

let socketidMobile;
let socketidDesktop;

////////////////GAME/////////////////////

let bounds;
let recorder = null;

let audioInput = null;
let volume = null;
let audioContext = null;
let lastClap = (new Date()).getTime();
let scene, camera, renderer;



let moveCameraUp = false;
let moveCameraDown = false;
let redGateArrX = [];
let redGateArrY = [];
let redcube = [];
let redcubehit = [];
let blueGateArrX = [];
let blueGateArrY = [];
let bluecube = [];
let bluecubehit = [];
let CameraYonder = 0;

let blueGate;
let redGate;

let particleGroup;
let particleAttributes;
let totalParticles = 1;
let radiusRange = 30;


let spelers = [];
let ownPlayer;

let playerX;
let playerY;
let playerIDParticles;
let desktopIDParticles;
let SpelerColor;

let shakeCam = false;
let score = 0;

const gates = player => {
  for(let i = 0; i < 160; i++){
    let random = (4000 * i);
    let posX = random + MathUtil.randomBetween(1000, 2000) + 10000;
    let posY2 = -window.innerHeight;
    let posY1 = window.innerHeight;

    blueGate = new BlueGate(MathUtil.randomPoint(bounds));
    redGate = new RedGate(MathUtil.randomPoint(bounds));

    redGateArrX.push(posX);
    blueGateArrX.push(posX);

    redGateArrY.push(posY2);
    redGateArrY.push(posY1);
    blueGateArrY.push(posY1);
    blueGateArrY.push(posY2);


    scene.add(redGate._initRed(redGateArrX[i], redGateArrY[i]));
    scene.add(blueGate._initBlue(blueGateArrX[i], blueGateArrY[i]));

    redcube.push(redGate.cube);
    redcubehit.push(redGate._hitRed());
    bluecube.push(blueGate.cube);
    bluecubehit.push(blueGate._hitBlue());

    playerX = player.positionX;
    playerIDParticles = player.playersocketid;
    desktopIDParticles = player.desktopsocketid;
    SpelerColor = player.color;
  }

  render();

};



let fix = true;
const gameOver = () => {
  if(fix){
    cancelAnimationFrame(render);
    document.querySelector('main').removeChild(renderer.domElement);
    socket.emit('gameover', playerIDParticles);
    document.getElementById('errorinfo').style.display = 'inline';
    document.getElementById('gameover').style.display = 'inline';
    document.getElementById('errorinfo').innerHTML = `You missed your gate, </br> your score was ${score} </br> Click restart to play again`;

    fix = false;
  }
};


const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const flipCamera = boolWhich => {
  if(boolWhich === 0){
    camera.rotation.z = -25;
    camera.position.z = 7000;
    delay(5000).then(() => {
      normalCamera();
    });
  }

  if(boolWhich === 1){
    camera.rotation.z = 105;
    camera.position.z = 7000;
    delay(5000).then(() => {
      normalCamera();
    });
  }

  if(boolWhich === 2){
    camera.rotation.z = -80.11;
    camera.position.z = 10000;
    delay(5000).then(() => {
      normalCamera();
    });
  }
};


const normalCamera = () => {
  camera.rotation.y = 0;
  camera.rotation.z = 0;
  camera.position.z = 4000;
  camera.position.y = 0;
};


const shakeCamera = () => {
  CameraYonder = MathUtil.randomBetween(50, 60);
  delay(2000).then(() => {
    CameraYonder = 0;
  });
};

const render = () => {

  if(shakeCam){
    shakeCamera();
    shakeCam = false;
  }

  playerX += 36;
  camera.position.x = playerX + 2200;


  if(moveCameraDown === false){
    camera.position.y += CameraYonder;
    if(camera.position.y >= window.innerHeight/7){
      moveCameraUp = true;
      moveCameraDown = true;
    }
  }

  if(moveCameraUp === true){
    camera.position.y -= CameraYonder;
    if(camera.position.y <= -window.innerHeight/7){
      moveCameraUp = false;
      moveCameraDown = false;
    }
  }


  for(let i = 0; i < redGateArrX.length; i++){

    let redY1 = redGateArrY[i] + window.innerHeight;
    let redY2 = redGateArrY[i] - window.innerHeight;
    let redX = redGateArrX[i];
    let arrRed = [];

    for (let b = redX - 50; b < redX + 50; b++) {
      arrRed.push(b);
    }

    if(arrRed !== []){
      arrRed.forEach(rood => {
        if(redY1 > playerY && redY2 < playerY && rood === playerX){
          if(SpelerColor === '#CA473E'){
            score++;
            document.getElementById('score').innerHTML = score;
            return;
          }else{
            document.getElementById('score').style.display = 'none';
            gameOver();
          }
          scene.remove(redcube[i]);
          scene.add(redcubehit[i]);
        }
      });
    }

    let blueY1 = blueGateArrY[i] + window.innerHeight;
    let blueY2 = blueGateArrY[i] - window.innerHeight;
    let blueX = blueGateArrX[i];
    let arrBlue = [];

    for (let l = blueX - 50; l < blueX + 50; l++) {
      arrBlue.push(l);
    }
    if(arrBlue !== []){
      arrBlue.forEach(blauw => {
        if(blueY1 > playerY && blueY2 < playerY && blauw === playerX){
          if(SpelerColor === '#2F94D1'){
            score++;
            document.getElementById('score').innerHTML = score;
          }else{
            document.getElementById('score').style.display = 'none';
            gameOver();
          }
          scene.remove(bluecube[i]);
          scene.add(bluecubehit[i]);
        }
      });
    }

  }

  particleGroup = new THREE.Object3D();
  particleAttributes = { startSize: [], startPosition: [], randomness: [] };

  particlesAdd();
  scene.add(particleGroup);

  particleGroup.position.x = playerX-50;
  particleGroup.position.y = playerY;

  socket.emit('particles', playerX, playerY, playerIDParticles, desktopIDParticles);

  renderer.render(scene, camera);
  requestAnimationFrame(() => render());
};

const particlesAdd = () => {

  for( let i = 0; i < totalParticles; i++ ) {

    var material = new THREE.MeshBasicMaterial({
      color: '#fff'
    });

    var radius = 7;
    var segments = 32;

    var circleGeometry = new THREE.CircleGeometry( radius, segments );

    let circle = new THREE.Mesh( circleGeometry, material );

    circle.position.setLength( radiusRange * (Math.random() * 0.1 + 1) );

    particleGroup.add(circle);
    particleAttributes.startPosition.push(circle.position.clone());
    particleAttributes.randomness.push(Math.random());
  }


};




const init = () => {

  socket.on('socketid', data => {
    if(initialized === false){
      socketid = data;
      if(Modernizr.touch) {
        $.get('/components/mobile.html', _mobile.bind(this));

        socketidMobile = socketid;
      } else {
        $.get('/components/desktop.html', _desktop.bind(this));
        socketidDesktop = socketid;
      }
    }
    initialized = true;
  });

  socket.on('yPosDownAllPlayers', (thisY, playerId ) => {

    if (spelers !== []) {
      spelers.forEach(speler => {
        if (speler.getSocketId() === playerId){
          speler.positionY = thisY;
        }
      });
    }
  });

  socket.on('yPosUpAllPlayers', (thisY, playerId ) => {
    if (spelers !== []) {
      spelers.forEach(speler => {
        if (speler.getSocketId() === playerId){
          speler.positionY = thisY;
        }
      });
    }
  });

  socket.on('blackoutToAll', (sockIdBlackout, socketDesktopID) => {
    if (spelers !== []) {
      spelers.forEach(speler => {
        if(speler.getDesktopSocketId() === socketDesktopID){
          document.getElementById('black').style.display = 'inline';
          delay(3000).then(() => {
            document.getElementById('black').style.display = 'none';
          });
        }
      });
    }

  });

  socket.on('removePlayer', socketidToDelete => {
    deleteplayer(socketidToDelete);
  });

  socket.on('schermwegdoen', desktopIdSocket => {
    document.getElementById('loginmobile').style.display = 'none';
    document.getElementById('allbuttons').style.display = 'inline';

    $('.disturb :submit').click(e => {
      e.preventDefault();
      if(desktopIdSocket){
        socket.emit('disturb', socketidMobile, desktopIdSocket);
      }
    });


    $('.downhill :submit').click(e => {
      e.preventDefault();
      if(desktopIdSocket){
        socket.emit('downhillFast', socketidMobile, desktopIdSocket);
      }
    });


    $('.flipview :submit').click(e => {
      e.preventDefault();
      if(desktopIdSocket){
        socket.emit('flipview', socketidMobile, desktopIdSocket);
      }
    });

    $('.blackout :submit').click(e => {
      e.preventDefault();
      if(desktopIdSocket){
        console.log(desktopIdSocket);
        socket.emit('blackout', socketidMobile, desktopIdSocket);
      }
    });

  });

  socket.on('thisIsANewSpeler', client => {
    document.getElementById('startinfo').style.display = 'inline-block';
    document.getElementById('score').style.display = 'inline-block';
    document.getElementById('score').innerHTML = score;
    document.getElementById('backgroundBalls2').style.display = 'inline-block';

    delay(5000).then(() => {
      document.getElementById('footer').style.display = 'none';
      document.getElementById('startinfo').style.display = 'none';
    });
    document.getElementById('startdeskt').style.display = 'none';

    $('#footer').addClass('animate-footer');
    delay(2000).then(() => {
      document.getElementById('footer').style.display = 'none';
    });
    let player = new Player(socket, client.socketidMobile, client.socketidDesktop, client.color);
    scene.add(player.render());
    ownPlayer = player;

    sound(player);
    gates(player);

  });

  socket.on('newplayer', client => {
    if(socketidDesktop !== client.socketidDesktop){
      let player = new Player(socket, client.socketidMobile, client.socketidDesktop, client.color);
      scene.add(player.render());
      spelers.push(player);
    }

  });

};


const deleteplayer = deleteSocketId => {
  if (spelers !== []) {
    spelers.forEach(speler => {
      if(speler.getSocketId() === deleteSocketId){
        scene.remove(speler.circle);
      }
    });
  }
};

const _desktop = htmlCode => {

  startBackgroundFromGame();
  $('.container').append($(htmlCode));



  socketidDesktop = socket.id;

  let code = MathUtil.makeCode();

  document.getElementById('putcodehere').innerHTML = code;

  socket.emit('ditIsDesktopSocket', code, socketidDesktop);


  socket.on('changeCameraViewToAll', (sockIdChangeView, socketDesktopID) => {
    flipCamera(MathUtil.randomBetween(0, 2));
  });

  socket.on('downHill', (IdFromDownHill, idFromDesktopDownHill) => {
    console.log('downhill fast');
    ownPlayer.positionY -= 200;
  });


  socket.on('disturbToAll', (sockIdDisturb, socketDesktopID) => {
    if (spelers !== []) {
      spelers.forEach(speler => {
        if(speler.getDesktopSocketId() === socketDesktopID){
          shakeCam = true;
        }
      });
    }

  });


};

const _mobile = htmlCode => {

  let randomBool = MathUtil.randomBetween(0, 1);

  if(randomBool === 1){
    SpelerColor = '#CA473E';
  }

  if(randomBool === 0){
    SpelerColor = '#2F94D1';
  }

  $('body').append($(htmlCode));
  document.getElementById('allbuttons').style.display = 'none';

  $('.login :submit').click(e => {
    e.preventDefault();
    let key = $('.login').find('input[type=text]').val().trim();
    socket.emit('ditIsMobileSocket', key, socketidMobile, SpelerColor);
  });

  socket.on('changeCameraViewToAll', (sockIdChangeView, socketDesktopID) => {
    document.getElementById('changeView').disabled = true;
    delay(5000).then(() => {
      document.getElementById('changeView').disabled = false;
    });
  });

  socket.on('blackoutToAll', (sockIdBlackout, socketDesktopID) => {
    document.getElementById('blackoutbtn').disabled = true;
    delay(5000).then(() => {
      document.getElementById('blackoutbtn').disabled = false;
    });
  });


  socket.on('gameoverplayer', socketIdTodelete => {
    document.getElementById('allbuttons').style.display = 'none';
    document.getElementById('loginmobile').style.display = 'inline-block';
    $('.codeloginmobile').val('');
  });

  socket.on('errorInformsubmit', iderror => {
    console.log('cool');
    $('#codeloginmobile').addClass('red-placeholder');
    $('.codeloginmobile').val('');
  });

};

const detectSound = (data, player) => {
  let t = (new Date()).getTime(); //krijg tijd binnen
  if(t - lastClap < 10) return false;

  let zeroCrossings = 0, highAmp = 0;
  for(let i = 1; i < data.length; i++){
    if(Math.abs(data[i]) > 0.25) highAmp++;
    if(data[i] > 0 && data[i-1] < 0 || data[i] < 0 && data[i-1] > 0) zeroCrossings++;
  }

  if(highAmp > 10){
    if(playerY < ((window.innerHeight*2) - 80)){
      player.positionY += 50;
      playerY = player.positionY;
      socket.emit('yPosUp', player.positionY, player.playersocketid);
    }

  }else{
    player.positionY -= 40;
    playerY = player.positionY;
    if(playerY < ((-window.innerHeight*2) + 80)){
      player.positionY = ((-window.innerHeight*2) + 80);
      socket.emit('yPosDown', player.positionY, player.playersocketid);
    }
  }

  return false;
};

const sound = player => {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if(navigator.getUserMedia){

    navigator.getUserMedia({
      audio: true
    },

    e => {

      volume = audioContext.createGain(); // creates a gain node
      audioInput = audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream
      audioInput.connect(volume);// connect the stream to the gain node
      recorder = audioContext.createScriptProcessor(2048, 1, 1);

      recorder.onaudioprocess = b =>{

        let left = b.inputBuffer.getChannelData(0);
        detectSound(left, player);
      };

      volume.connect(recorder);// connect the recorder
      recorder.connect(audioContext.destination);
    },
    () => { //failure
      let customAlert;
      customAlert('Error capturing audio.');
    });

  } else {
    let customAlert;
    customAlert('getUserMedia not supported in this browser.');
  }
};


const startBackgroundFromGame = () => {

  let AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();

  bounds = {
    width: window.innerWidth,
    height: window.innerHeight - 400,
    depth: 1000,
    border: 40
  };

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight,
    90, 0
  );

  renderer = new THREE.WebGLRenderer( { alpha: true } );

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  document.querySelector('main').appendChild(renderer.domElement);

  camera.position.z = 4000;

};



init();
