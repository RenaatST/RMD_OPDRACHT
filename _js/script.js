'use strict';
// import {html} from './helpers/util';
import {MathUtil} from './modules/util/';
import BlueGate from './modules/render/BlueGate';
import RedGate from './modules/render/RedGate';
import Player from './modules/render/Player';
import {html} from './helpers/util';

/////////////SOCKET NODE USER SMARTPHONE/////////////
/////////////SOCKET NODE USER SMARTPHONE/////////////
/////////////SOCKET NODE USER SMARTPHONE/////////////

let player;
let $window = $(window);
let $usernameInput = $('.usernameInput');
let $loginPage = $('.login.page');
let $gamepage = $('.game.page');
let username;
let connected;
let $currentInput = $usernameInput.focus();
let initialized = false;
let users = [];

let socket = io();

let form = $('form.login');
let form2 = $('form.usernameform');
let secretTextBox = form.find('input[type=text]');
let secretTextBox2 = form2.find('input[type=text]');
let presentation = $('.gamepage');
let key = '', animationTimeout;


///////////////////////GAME///////////////////////////
///////////////////////GAME///////////////////////////
///////////////////////GAME///////////////////////////

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

var spelers;
var adder;
spelers = [];
adder = [];

const gamepage = () => {

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




const countdown = () => {
  let seconds;
  let temp;
  let timeout;

  seconds = document.getElementById('countdown').style.visibility = "visible";
  seconds = document.getElementById('countdown').innerHTML;
  seconds = parseInt(seconds, 10);

  if (seconds == 1) {
    temp = document.getElementById("countdown").remove();
    gamepage();
    return;
  }

  seconds--;
  temp = document.getElementById('countdown');
  temp.innerHTML = seconds;
  timeout = setTimeout(countdown, 1000);
}



const delay = (ms) => {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
};


const flipCamera = () => {
  console.log('flip');
  camera.rotation.y = -25;
  camera.rotation.z = 80.11;
  camera.position.z = 5500;
  camera.position.y = -1250;
  delay(5000).then(function() {
    normalCamera();
  });
};


const normalCamera = () => {
  console.log('normal');
  camera.rotation.y = 0;
  camera.rotation.z = 0;
  camera.position.z = 4000;
  camera.position.y = 0;
};


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


  moveY -= 5;
  moveX += 15;


  if(ok){
    for(let i = 0; i < spelers.length; i++){
      // scene.add(adder[i]);
      spelers[i].position.x = -3000 + moveX;
      spelers[i].position.y = moveY;
    }
  }

  camera.position.x = moveX;

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
        console.log('RED GATE - HIT');
        scene.remove(redcube[i]);
        scene.add(redcubehit[i]);
      }

    }

    let blueY1 = blueGateArrY[i] + window.innerHeight/2;
    let blueY2 = blueGateArrY[i] - window.innerHeight/2;
    let blueX = 3000 + blueGateArrX[i];
    if(hitBlue){
      if(blueY1 > moveY && blueY2 < moveY && blueX < moveX){
        console.log('BLUE GATE - HIT');
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
  var totalParticles = 1;
  var radiusRange = 30;

  for( var i = 0; i < totalParticles; i++ ) {
    var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, color: 0x0000FF} );
    var sprite = new THREE.Sprite( spriteMaterial );
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

  var time = 4 * clock.getElapsedTime();

  for ( var c = 0; c < particleGroup.children.length; c ++ )
  {
    var sprite = particleGroup.children[ c ];
    var a = particleAttributes.randomness[c] + 10;
    var pulseFactor = Math.sin(a * time) * 0.1+ 0.5;
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
        var left = b.inputBuffer.getChannelData(0);
        // var right = e.inputBuffer.getChannelData(1);
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

  var t = (new Date()).getTime(); //krijg tijd binnen
  if(t - lastClap < 10) return false;

  var zeroCrossings = 0, highAmp = 0;
  for(var i = 1; i < data.length; i++){
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



  if(Modernizr.touch) {
    console.log('mobile');
    $.get('/components/mobile.html', _mobile.bind(this));
  } else {
    console.log('desktop');
    $.get('/components/desktop.html', _desktop.bind(this));
  }


  socket.on('user left', data => {
    log(`${data.username} left`);
    addParticipantsMessage(data);
  });

  socket.on('add_new_user', client => {
    $('.start-desktop').hide();
    makeNewClient(client);
    //console.log("new user" + data);
  });

  socket.on('switch', data => {
    let newColor = Math.random() * 0xffffff;
    renderer.setClearColor(newColor, 1);
    console.log('boost');
  });


};


let speler = true;

const makeNewClient = client => {
    console.log("this is client " + client.socketid);
    ok = true;
    player = new Player(client.socketid, MathUtil.randomPoint(bounds), Player.MOVING);
    player.type = Player.MOVING;
    player.move = true;
    spelers.push(player);
    adder.push(player._initPlayer(speed));
    newPlayer();
}

const newPlayer = () => {
  if(ok){
    for(let i = 0; i < spelers.length; i++){
      moveY -= 5;
      moveX += 50;
      scene.add(adder[i]);
      spelers[i].position.x = -3000 + moveX;
      spelers[i].position.y = moveY;
    }
  }
};


///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////

const _desktop = htmlCode => {
  $('body').append($(htmlCode));
  // countdown();
  gamepage();
};

const _mobile = htmlCode => {

  $('body').append($(htmlCode));

  $('.button :submit').click(function(e) {
    e.preventDefault();
    socket.emit('new_user', socket.id);
    $('.start-mobile').hide();
    console.log('start mobile');
  });

  $('.knop1 :submit').click(function(e) {
    e.preventDefault();
    console.log('knop');
    socket.emit('boost', 'mobile');
  });

};



init();
