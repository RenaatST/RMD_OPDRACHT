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
spelers = [];


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





const init = () => {



  socket.on("ditisiets", data => {
    console.log('dit is iets');
  });

  socket.on("socketid", data => {

    if(initialized === false){
      socketid = data;
      if(Modernizr.touch) {
        $.get('/components/mobile.html', _mobile.bind(this));
      } else {
         $.get('/components/desktop.html', _desktop.bind(this));
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
  if (spelers !== []) {
    spelers.forEach(function(speler) {
        if (speler.getSocketId() === socketid){
          console.log("removed: " + socketid);
          console.log(speler);

          scene.remove(speler.circle);
        }
    });
    console.log(spelers.length);
  }
};




const _desktop = htmlCode => {
  $('body').append($(htmlCode));
  startBackgroundFromGame();

  socket.on('removePlayer', socketid => {
    deleteplayer(socketid);
  });


  socket.on('yfromplayergoesup', (posY, socketid) => {
    if (spelers !== []) {
      spelers.forEach(function(speler) {
          if (speler.getSocketId() === socketid){
            console.log(posY);
            console.log(socketid);

            speler.circle.position.y = posY;


          }
      });
    }

    //console.log('player ' + socketidplayerchanged + ' changed y ' + ypos);
  });

  socket.on('playerdownPosChange', data => {
    console.log("doooooooown" + data);
    //console.log('player ' + socketidplayerchanged + ' changed y ' + ypos);
  });



};

const _mobile = htmlCode => {
  $('body').append($(htmlCode));
  let mobile = new Mobile(socket, socketid);
};


const makeNewClient = client => {
  let player = new Player(socket, client.socketid, client.color);
  spelers.push(player);
  scene.add(player.render());
};


const startBackgroundFromGame = () => {

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
  //sound();
};



init();
