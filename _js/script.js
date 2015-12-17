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
let scene, camera, renderer, composer;
let hblur, vblur;


//gates
let hitRed = true;
let hitBlue = true;
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

let spelers;
spelers = [];

let playerX;
let playerY;



let shakeCam = true;

const gates = player => {
  console.log(player);
  for(let i = 0; i < 10; i++){
    let random = (3000 * i);
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

  }

  render(player);
};



// CAMERA //


const delay = (ms) => {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
};


// const flipCamera = () => {
//   console.log('flip');
//   camera.rotation.y = -25;
//   camera.rotation.z = 80.11;
//   camera.position.z = 3500;
//   delay(MathUtil.randomBetween(5000, 30000)).then(function() {
//     nomralCamera();
//   });
// };


// const normalCamera = () => {
//   camera.rotation.y = 0;
//   camera.rotation.z = 0;
//   camera.position.z = 4000;
//   camera.position.y = 0;
//   delay(MathUtil.randomBetween(5000, 30000)).then(function() {
//     flipCamera();
//   });
// };


// const shakeCamera = () => {
//   CameraYonder = MathUtil.randomBetween(50,60);
//   delay(2000).then(function() {
//     CameraYonder = 0;
//   });
// }



const render = player => {

  // if(shakeCam){
  //   delay(5000).then(function() {
  //     shakeCamera();
  //   });
  //   shakeCam = false;
  // }

  playerX += 5;
  camera.position.x = playerX;


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

    if(hitRed){
      for (let i = redX - 50; i < redX + 50; i++) {
        arrRed.push(i);
      }
      if(arrRed !== []){
        arrRed.forEach(rood => {
         if(redY1 > playerY && redY2 < playerY && rood === playerX){
            console.log('RED GATE - HIT');
            scene.remove(redcube[i]);
            scene.add(redcubehit[i]);
          }
        });
      }
    }

    let blueY1 = blueGateArrY[i] + window.innerHeight;
    let blueY2 = blueGateArrY[i] - window.innerHeight;
    let blueX = blueGateArrX[i];
    let arrBlue = [];
    if(hitBlue){
      for (let i = blueX - 50; i < blueX + 50; i++) {
        arrBlue.push(i);
      }
      if(arrBlue !== []){
        arrBlue.forEach(blauw => {
         if(blueY1 > playerY && blueY2 < playerY && blauw === playerX){
            console.log('BLUE GATE - HIT');
            scene.remove(bluecube[i]);
            scene.add(bluecubehit[i]);
          }
        });
      }
    }

  }






  // PARTICLES //
  particleGroup = new THREE.Object3D();
  particleAttributes = { startSize: [], startPosition: [], randomness: [] };
  let totalParticles = 1;
  let radiusRange = 30;


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


  renderer.render(scene, camera);
  requestAnimationFrame(() => render());
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

  socket.on('downHill', IdFromDownHill => {

    if (spelers !== []) {
      spelers.forEach(speler => {
        if(speler.getSocketId() === IdFromDownHill){
          console.log("Downhill " + speler.playersocketid + " met y pos " + speler.positionY);

          /////////////////////////////////DOWNHILL/////////////////////////////////////////




        }
      });
    }

  });

  socket.on('disturbToAll', sockIdDisturb => {

    if (spelers !== []) {
      spelers.forEach(speler => {
        if(speler.getSocketId() === sockIdDisturb){
          console.log("Disturb  " + speler.playersocketid + " met y pos " + speler.positionY);

          /////////////////////////////////DISTURB/////////////////////////////////////////






        }
      });
    }

  });

  socket.on('changecolorToAll', sockIdShuffle => {

    if (spelers !== []) {
      spelers.forEach(speler => {
        if(speler.getSocketId() === sockIdShuffle){
          console.log("Change color " + speler.playersocketid + " met y pos " + speler.positionY);


          /////////////////////////////////CHANGE COLOR/////////////////////////////////////////





        }
      });
    }

  });

  socket.on('shuffleToAll', sockIdColor => {

    if (spelers !== []) {
      spelers.forEach(speler => {
        if(speler.getSocketId() === sockIdColor){
          console.log("Shuffle all " + speler.playersocketid + " met y pos " + speler.positionY);

          /////////////////////////////////SHUFFLE/////////////////////////////////////////





        }
      });
    }

  });


  socket.on('schermwegdoen', () => {
    document.getElementById("loginmobile").style.display = "none";
    document.getElementById("allbuttons").style.display = "inline";



  });

  socket.on('thisIsANewSpeler', client => {

    document.getElementById("startdeskt").style.display = "none";

    let player = new Player(socket, client.socketidMobile, client.socketidDesktop, client.color);
    scene.add(player.render());
    spelers.push(player);
    sound(player);
    gates(player);
  });

  socket.on('yPosupdateDown', (thisY, playerId ) => {
    //console.log(thisY + " playerid " + playerId);

    if (spelers !== []) {
      spelers.forEach(speler => {
        if (speler.getSocketId() === playerId){
          speler.positionY = thisY;
        }
      });
    }
  });

  socket.on('yPosupdate', (thisY, playerId ) => {
    //console.log(thisY + " playerid " + playerId);

    if (spelers !== []) {
      spelers.forEach(speler => {
        if (speler.getSocketId() === playerId){
          speler.positionY = thisY;
        }
      });
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

  let code = MathUtil.makeCode();

  //$('body').prepend(code);
  console.log(code);
  document.getElementById("putcodehere").innerHTML = code;

  socket.emit('ditIsDesktopSocket', code, socketidDesktop);

  socket.on('newplayer', client => {

    console.log("new player" + client.socketidMobile);
    if(socketidDesktop !== client.socketidDesktop){

      let player = new Player(socket, client.socketidMobile, client.socketidDesktop, client.color);
      console.log(`naar iedereen behalve zichzelf: deze speler is toegevoegd ${player.playersocketid}`);
      scene.add(player.render());
    }
  });


};

const _mobile = htmlCode => {


  $('body').append($(htmlCode));
  document.getElementById("allbuttons").style.display = "none";

  $('.login :submit').click(e => {
    e.preventDefault();

    let key = $('.login').find('input[type=text]').val().trim();
    socket.emit('ditIsMobileSocket', key, socketidMobile);
  });

  $('.downhill :submit').click(e => {
    e.preventDefault();
    console.log('downhill');

    socket.emit('downhillFast', socketidMobile);
  });

  $('.disturb :submit').click(e => {
    e.preventDefault();
    console.log('disturb');
    socket.emit('disturb', socketidMobile);
  });

  $('.changecolor :submit').click(e => {
    e.preventDefault();
    console.log('changecolor');
    socket.emit('changecolor', socketidMobile);
  });

  $('.shuffle :submit').click(e => {
    e.preventDefault();
    console.log('shuffle');
    socket.emit('shuffle', socketidMobile);
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
    //console.log('up');
    player.positionY += 10;
    playerY = player.positionY;

    // createjs.Tween.get(player.circle, { loop: true })
    // .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
    // .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
    // .to({ alpha: 0, y: 225 }, 100)
    // .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
    // .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

    //console.log(`!sound got from mobileid = ${player.playersocketid}`);
    socket.emit('yPosUp', player.positionY, player.playersocketid);

  }else{
    player.positionY -= 5;
    playerY = player.positionY;
    socket.emit('yPosUp', player.positionY, player.playersocketid);
    //socket.emit("yPosDown", player.positionY, player.playersocketid);
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

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  document.querySelector('main').appendChild(renderer.domElement);

  camera.position.z = 4000;

  renderer.setClearColor('#FAE17D', 1);

  // normalCamera();

};



init();
