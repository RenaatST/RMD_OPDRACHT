'use strict';

import {MathUtil} from './modules/util/';
import BlueGate from './modules/render/BlueGate';
import RedGate from './modules/render/RedGate';
import Player from './modules/render/Player';
import {html} from './helpers/util';
import Mobile from './modules/mobile/Mobile';


let initialized = false;
let socketid, clients;
let socket = io();

////////////////GAME/////////////////////


let bounds;
let geluid = true;
let recorder = null;
let recording = true;

let audioInput = null;
let volume = null;
let audioContext = null;
let lastClap = (new Date()).getTime();
let scene, camera, renderer;
let moveX = 0;
let moveY = 0;

//gates
let hitRed = true;
let hitBlue = true;
let rotation = 0;
let moveCameraUp = false;
let moveCameraDown = false;
let switchgate = false;
let redGateArrX = [];
let redGateArrY = [];
let redcube = [];
let redcubehit = [];
let blueGateArrX = [];
let blueGateArrY = [];
let bluecube = [];
let bluecubehit = [];
let CameraYboven = 0;
let CameraYonder = 0;
let speed = 0;

let blueGate;
let redGate;

let particleGroup;
let particleAttributes;
let clock = new THREE.Clock();
let particleTexture = new THREE.TextureLoader().load( '../assets/image/particle.png');

let spelers;
let adder;
spelers = [];
adder = [];


const gates = () => {

  for(let i = 0; i < 10; i++){
    let random = (3000 * i);
    let posX = random + MathUtil.randomBetween(1000,2000);
    let posY2 = 0-window.innerHeight/2;
    let posY = window.innerHeight-window.innerHeight/2;

    blueGate = new BlueGate(MathUtil.randomPoint(bounds));
    redGate = new RedGate(MathUtil.randomPoint(bounds));

    redGateArrX.push(posX);
    blueGateArrX.push(posX);

    redGateArrY.push(posY2);
    blueGateArrY.push(posY);
    redGateArrY.push(posY);
    blueGateArrY.push(posY2);

    scene.add(redGate._initRed(redGateArrX[i], redGateArrY[i]));
    scene.add(blueGate._initBlue(blueGateArrX[i], blueGateArrY[i]));

    redcube.push(redGate.cube);
    redcubehit.push(redGate._hitRed());
    bluecube.push(blueGate.cube);
    bluecubehit.push(blueGate._hitBlue());

  }

  render();

};


let ok = false;

const render = () => {
  //player


  // moveY -= 5;
  // moveX += 15;


  // if(ok){
  //   for(let i = 0; i < spelers.length; i++){
  //     // scene.add(adder[i]);
  //     spelers[i].position.x = -3000 + moveX;
  //     spelers[i].position.y = moveY;
  //   }
  // }

  //camera.position.x = moveX;

  CameraYonder = 2;
  CameraYboven = 2;

  if(moveCameraDown === false){
    camera.position.y += CameraYonder;
    if(camera.position.y >= window.innerHeight/5){
      moveCameraUp = true;
      moveCameraDown = true;
    }
  }

  if(moveCameraUp === true){
    camera.position.y -= CameraYonder;
    if(camera.position.y <= -window.innerHeight/10){
      moveCameraUp = false;
      moveCameraDown = false;
    }
  }


  for(let i = 0; i < redGateArrX.length; i++){

    let redY1 = redGateArrY[i] + window.innerHeight/2;
    let redY2 = redGateArrY[i] - window.innerHeight/2;
    let redX = 3000 + redGateArrX[i];

    if(hitRed){
      if(redY1 > moveY && redY2 < moveY && redX < moveX){
        //console.log('RED GATE - HIT');
        scene.remove(redcube[i]);
        scene.add(redcubehit[i]);
      }

    }

    let blueY1 = blueGateArrY[i] + window.innerHeight/2;
    let blueY2 = blueGateArrY[i] - window.innerHeight/2;
    let blueX = 3000 + blueGateArrX[i];
    if(hitBlue){
      if(blueY1 > moveY && blueY2 < moveY && blueX < moveX){
        //console.log('BLUE GATE - HIT');
        scene.remove(bluecube[i]);
        scene.add(bluecubehit[i]);
      }
    }

    // if(switchgate){
    //   scene.add(blueGate._switch());
    // }

  }


  // PARTICLES //
  particleGroup = new THREE.Object3D();
  particleAttributes = { startSize: [], startPosition: [], randomness: [] };
  let totalParticles = 1;
  let radiusRange = 30;

  for( let i = 0; i < totalParticles; i++ ) {
    let spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, color: 0x0000FF} );
    let sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set( 15, 15, 1.0 ); // imageWidth, imageHeight
    sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

    sprite.position.setLength( radiusRange * (Math.random() * 0.1 + 0.9) );
    sprite.material.color.setHSL( Math.random(), Math.random(), Math.random() );
    // sprite.opacity = 0.80; // translucent particles
    sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
    particleGroup.add(sprite);
    particleAttributes.startPosition.push(sprite.position.clone());
    particleAttributes.randomness.push(Math.random());
  }

  scene.add(particleGroup);

  let time = 4 * clock.getElapsedTime();

  for ( let c = 0; c < particleGroup.children.length; c ++ )
  {
    let sprite = particleGroup.children[ c ];
    let a = particleAttributes.randomness[c] + 10;
    let pulseFactor = Math.sin(a * time) * 0.1+ 0.5;
    sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;

  }
  particleGroup.rotation.x = time * 1;
  // particleGroup.position.x = player.position.x-80;
  // particleGroup.position.y = player.position.y+5;


  renderer.render(scene, camera);
  requestAnimationFrame(() => render());
};



const sound = () => {

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
        if(!recording) return;
        let left = b.inputBuffer.getChannelData(0);
        // let right = e.inputBuffer.getChannelData(1);
        detectSound(left);
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


const detectSound = data => {

  let t = (new Date()).getTime(); //krijg tijd binnen
  if(t - lastClap < 10) return false;

  let zeroCrossings = 0, highAmp = 0;
  for(let i = 1; i < data.length; i++){
    if(Math.abs(data[i]) > 0.25) highAmp++;
    if(data[i] > 0 && data[i-1] < 0 || data[i] < 0 && data[i-1] > 0) zeroCrossings++;
  }

  if(geluid){
    if(highAmp > 20){
      lastClap = t;
      moveY += 70;
    }
  }

  return false;

};


const init = () => {

  console.log("init");

  socket.on("socketid", data => {

    if(initialized === false){
      socketid = data;
      if(Modernizr.touch) {
        $.get('/components/mobile.html', _mobile.bind(this));
        //socket.emit('new_user', socket.id);
      } else {
        //$.get('/components/mobile.html', _mobile.bind(this));
         $.get('/components/desktop.html', _desktop.bind(this));
         console.log('modernizr desktop');
        //_mobile.call(this, socketid);
      }
    }
    initialized = true;
  });

  socket.on('thisIsANewSpeler', client => {
    makeNewClient(client);
  });

};

const deleteplayer = socketid => {
  console.log("this is client we need to delete " + socketid);

};




const _desktop = htmlCode => {
  $('body').append($(htmlCode));
  startBackgroundFromGame();


  socket.on('deleteplayer', socketid => {
    deleteplayer(socketid);
  });
};

const _mobile = htmlCode => {
  $('body').append($(htmlCode));

  let mobile = new Mobile(socket, socketid);


};


let speler = true;



const makeNewClient = client => {


  console.log('thisIsANewSpeler' + client.color);
  let player = new Player(client.socketid, client.color, MathUtil.randomPoint(bounds).x, MathUtil.randomPoint(bounds).y);

  scene.add(player.render());
  console.log("this is client " + client);
  // ok = true;
  // player = new Player(socketid, MathUtil.randomPoint(bounds).x, MathUtil.randomPoint(bounds).y, Player.MOVING);
  // spelers.push(player);
  // //adder.push(player._initPlayer(speed));
  // newPlayer(player);
};

const newPlayer = player => {
  // scene.add(player._initPlayer());
  // player.position.x = moveX;
  // player.position.y = moveY;

  //player.position.x = player.position.x + moveX;
  //player.position.y = player.position.y;

  /*if(ok){
    for(let i = 0; i < spelers.length; i++){
      //moveY -= 5;
      //moveX += 50;
      scene.add(adder[i]);
      spelers[i].position.x = player.position.x + moveX;
      spelers[i].position.y = moveY;
    }
  }*/
};



const startBackgroundFromGame = () => {
  //console.log('game start');

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

  renderer.setClearColor('#FFAF36', 1);



  gates();
  sound();
};



init();
