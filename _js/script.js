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

let speed;
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
let clock = new THREE.Clock();
let particleTexture = new THREE.TextureLoader().load( '../assets/image/particle.png');
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
let text;
let givespeed;


const gates = player => {
  //console.log(player);
  for(let i = 0; i < 160; i++){
    let random = (4000 * i);
    let posX = random + MathUtil.randomBetween(1000, 2000);
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



  render(player);

};



let fix = true;

const gameOver = () => {
  if(fix){
    cancelAnimationFrame(render);
    document.querySelector('main').removeChild(renderer.domElement);
    socket.emit("gameover", playerIDParticles);
    document.getElementById("errorinfo").style.display = "inline";
    document.getElementById("gameover").style.display = "inline";
    fix = false;
  }
};


const delay = (ms) => {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
};


const flipCamera = boolWhich => {
  console.log(boolWhich);

  if(boolWhich === 0){
    camera.rotation.z = -25;
    camera.position.z = 7000;
    delay(5000).then(function() {
      normalCamera();
    });
  }

  if(boolWhich === 1){
    camera.rotation.z = 105;
    camera.position.z = 7000;
    delay(5000).then(function() {
      normalCamera();
    });
  }

  if(boolWhich === 2){
    camera.rotation.z = -80.11;
    camera.position.z = 10000;
    delay(5000).then(function() {
      normalCamera();
    });
  }
};


const normalCamera = () => {
  camera.rotation.y = 0;
  camera.rotation.z = 0;
  camera.position.z = 4000;
  camera.position.y = 0;
  // delay(MathUtil.randomBetween(5000, 30000)).then(function() {
  //   flipCamera();
  // });
};


const shakeCamera = () => {
  CameraYonder = MathUtil.randomBetween(50,60);
  delay(2000).then(function() {
    CameraYonder = 0;
  });
}

const render = player => {

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



    for (let i = redX - 50; i < redX + 50; i++) {
      arrRed.push(i);
    }
    if(arrRed !== []){
      arrRed.forEach(rood => {
       if(redY1 > playerY && redY2 < playerY && rood === playerX){
          //console.log('RED GATE - HIT');

          if(SpelerColor == '#CA473E'){
            console.log("dit is het juist kleur");
          }else{
            console.log("game over");
            //gameOver();
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

    for (let i = blueX - 50; i < blueX + 50; i++) {
      arrBlue.push(i);
    }
    if(arrBlue !== []){
      arrBlue.forEach(blauw => {
       if(blueY1 > playerY && blueY2 < playerY && blauw === playerX){
          //console.log('BLUE GATE - HIT');

          if(SpelerColor == '#2F94D1'){
            console.log("dit is het juist kleur");
          }else{
            console.log("game over");
            //gameOver();
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

  let time = 2 * clock.getElapsedTime();

  for ( let c = 0; c < particleGroup.children.length; c++){
    // let sprite = particleGroup.children[ c ];
    // let a = particleAttributes.randomness[c] + 10;
    // let pulseFactor = Math.sin(a * time) * 0.1 + 0.5;
    // sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;
  }

  // particleGroup.rotation.x = time * 1;
  particleGroup.position.x = playerX-50;
  particleGroup.position.y = playerY;


  // console.log(playerX);
  // console.log(playerY);
  // console.log(playerIDParticles);

  socket.emit("particles", playerX, playerY, playerIDParticles, desktopIDParticles);




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

    // let spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, color: 0x0000FF} );
    // let sprite = new THREE.Sprite( spriteMaterial );
    let circle = new THREE.Mesh( circleGeometry, material )

    // circle.scale.set( 15, 15, 1.0 ); // imageWidth, imageHeight
    // circle.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

    circle.position.setLength( radiusRange * (Math.random() * 0.1 + 1) );
    // sprite.material.color.setHSL( Math.random(), Math.random(), Math.random() );
    // sprite.opacity = 0.80; // translucent particles
    // sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
    particleGroup.add(circle);
    particleAttributes.startPosition.push(circle.position.clone());
    particleAttributes.randomness.push(Math.random());
  }


};




const init = () => {

  speed = 5;



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

    socket.on('disturbToAll', (sockIdDisturb, socketDesktopID) => {
    if (spelers !== []) {
      spelers.forEach(speler => {
        if(speler.getDesktopSocketId() !== socketDesktopID){
          //console.log("Disturb  " + speler.playersocketid + " met y pos " + speler.positionY);
          shakeCam = true;

        }
      });
    }

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
        if(speler.getDesktopSocketId() == socketDesktopID){
          document.getElementById("black").style.display = "inline";
          delay(3000).then(function() {
            document.getElementById("black").style.display = "none";
          });
        }
      });
    }
  });

  socket.on('schermwegdoen', desktopIdSocket => {
    document.getElementById("loginmobile").style.display = "none";
    document.getElementById("allbuttons").style.display = "inline";



    $('.disturb :submit').click(e => {
       e.preventDefault();
       console.log('disturb');

       if(desktopIdSocket){
          console.log(desktopIdSocket);
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
     console.log('blackout');
     if(desktopIdSocket){
      console.log(desktopIdSocket);
      socket.emit('blackout', socketidMobile, desktopIdSocket);
     }
    });

  });

  socket.on('thisIsANewSpeler', client => {
    document.getElementById("startinfo").style.display = "inline-block";

    document.getElementById("backgroundBalls2").style.display = "inline-block";

    delay(5000).then(function() {
      document.getElementById("footer").style.display = "none";
      document.getElementById("startinfo").style.display = "none";
    })
    document.getElementById("startdeskt").style.display = "none";

    $("#footer").addClass("animate-footer");
    delay(2000).then(function() {
      document.getElementById("footer").style.display = "none";
    })
    let player = new Player(socket, client.socketidMobile, client.socketidDesktop, client.color);
    scene.add(player.render());
    ownPlayer = player;

    sound(player);
    gates(player);

  });

  socket.on('newplayer', client => {

    //console.log("new player" + client.socketidMobile);
    if(socketidDesktop !== client.socketidDesktop){
      let player = new Player(socket, client.socketidMobile, client.socketidDesktop, client.color);
      //console.log(`naar iedereen behalve zichzelf: deze speler is toegevoegd ${player.playersocketid}`);
      scene.add(player.render());
      spelers.push(player);
    }

  });

};


const deleteplayer = deleteSocketId => {
  //console.log("this is client we need to delete " + socketid);
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

  socket.on('removePlayer', socketidToDelete => {
    deleteplayer(socketidToDelete);
  });

  socketidDesktop = socket.id;
  console.log('dit is socket.id ' + socket.id + " en dit is nu de socketidDesktop " + socketidDesktop);

  let code = MathUtil.makeCode();

  //$('body').prepend(code);
  console.log(code);
  document.getElementById("putcodehere").innerHTML = code;

  socket.emit('ditIsDesktopSocket', code, socketidDesktop);


  socket.on('changeCameraViewToAll', (sockIdChangeView, socketDesktopID) => {
    flipCamera(MathUtil.randomBetween(0, 2));
  });

  socket.on('downHill', (IdFromDownHill, idFromDesktopDownHill) => {
    console.log("downhill fast");
    ownPlayer.positionY -= 200;

  });






};

const _mobile = htmlCode => {



  let randomBool = MathUtil.randomBetween(0,1);

  if(randomBool == 1){
    SpelerColor = '#CA473E';
  }

  if(randomBool == 0){
    SpelerColor = '#2F94D1';
  }

  $('body').append($(htmlCode));
  document.getElementById("allbuttons").style.display = "none";

  $('.login :submit').click(e => {
    e.preventDefault();

    let key = $('.login').find('input[type=text]').val().trim();
    socket.emit('ditIsMobileSocket', key, socketidMobile, SpelerColor);
  });

  socket.on('changeCameraViewToAll', (sockIdChangeView, socketDesktopID) => {

    document.getElementById("changeView").disabled = true;

    delay(5000).then(function() {
     document.getElementById("changeView").disabled = false;
    });


  });

  socket.on('blackoutToAll', (sockIdBlackout, socketDesktopID) => {

    document.getElementById("blackoutbtn").disabled = true;

    delay(5000).then(function() {
     document.getElementById("blackoutbtn").disabled = false;
    });


  });




  socket.on('gameoverplayer', socketIdTodelete => {

    document.getElementById("allbuttons").style.display = "none";
    document.getElementById("loginmobile").style.display = "inline-block";
    $('.codeloginmobile').val('');
  });

  socket.on('errorInformsubmit', iderror => {
    console.log('cool');
    // document.getElementById("error").style.display = "inline";
    $("#codeloginmobile").addClass("red-placeholder");
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

  if(highAmp > 30){
    //console.log('up');

    if(playerY < ((window.innerHeight*2) + 0) ){

      player.positionY += 50;
      playerY = player.positionY;
      // if(camera.position.z < 4500){
      //   camera.position.z -= 20;
      // }

      socket.emit('yPosUp', player.positionY, player.playersocketid);
    }

  }else{
    player.positionY -= 50;
    playerY = player.positionY;

    if(playerY < ((-window.innerHeight*2) + 80)){
      player.positionY = ((-window.innerHeight*2) + 80);
      // if(camera.position.z < 4000){
      //  camera.position.z += 5;
      // }else{
      //   camera.position.z = 4000
      // }

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
