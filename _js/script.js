'use strict';

import {html} from './helpers/util';

let $window = $(window);
let $usernameInput = $('.usernameInput');
let $loginPage = $('.login.page');
let $gamepage = $('.game.page');
let username;
let connected;
let $currentInput = $usernameInput.focus();

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


let material = new THREE.MeshBasicMaterial({color: '#F9C224', wireframe: true});
var geometry = new THREE.SphereGeometry( 50, 1, 1 );
let circle = new THREE.Mesh(geometry, material);
var geometryTail = new THREE.SphereGeometry( 5, 32, 32 );
//gates
let hitRed = true;
let hitBlue = true;
let rotation = 0;
let blueGate = new BlueGate(MathUtil.randomPoint(bounds), rotation);
let redGate = new RedGate(MathUtil.randomPoint(bounds));




import {MathUtil, SoundUtil} from './modules/util/';
import BlueGate from './modules/render/BlueGate';
import RedGate from './modules/render/RedGate';


const gamepage = () => {

  let spriteMaterial = new THREE.SpriteMaterial(
  {
    map: new THREE.ImageUtils.loadTexture( '../assets/nodemon.png'),
    useScreenCoordinates: false,
    color: '#ffffff' , transparent: false, blending: THREE.AdditiveBlending
  });

  let sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(50, 50, 1.0);
  circle.add(sprite);

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
    50, window.innerWidth / window.innerHeight,
    1, 5000
  );

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  document.querySelector('main').appendChild(renderer.domElement);

  camera.position.z = 1900;
  camera.rotation.y = -0.5;
  renderer.setClearColor('#010322', 1);

  player();
  blue();
  red();
  sound();


};


const red = () => {
  scene.add(redGate._initRed());
};


const blue = moveX1 => {
  scene.add(blueGate._initBlue());
};

const player = () => {
  scene.add(circle);
  render();
};
const render = () => {
  //player
  moveX += 20;
  circle.position.x = moveX;
  circle.position.y = moveY;
  circle.rotation.x -= 0.05;
  circle.rotation.y = -1;

  let materialTail = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});
  let circleTail= new THREE.Mesh(geometryTail, materialTail);
  scene.add(circleTail);
  circleTail.position.x = moveX - 35;
  circleTail.position.y = moveY;
  circleTail.rotation.y = 0.5;
  camera.position.x = moveX;
  //redGate
  let redY1 = redGate.position.y + 275;
  let redY2 = redGate.position.y - 275;
  let redX = redGate.position.x;

  if(hitRed){
    if(redY1 > moveY && redY2 < moveY && redX === moveX){
      console.log('RED GATE - HIT');
      scene.remove(redGate.cube);
      scene.add(redGate._hitRed());
      hitRed = false;
    }else{

    }
  }

  let blueY1 = blueGate.position.y + 275;
  let blueY2 = blueGate.position.y - 275;
  let blueX = blueGate.position.x;
  if(hitBlue){
    if(blueY1 > moveY && blueY2 < moveY && blueX === moveX){
      console.log('BLUE GATE - HIT');
      scene.remove(blueGate.cube);
      scene.add(blueGate._hitBlue());
      hitBlue = false;
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(() => render());
};


const sound = () => {

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if(navigator.getUserMedia){

    navigator.getUserMedia({
      audio: true
    },

    function(e){
      volume = audioContext.createGain(); // creates a gain node
      audioInput = audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream
      audioInput.connect(volume);// connect the stream to the gain node
      recorder = audioContext.createScriptProcessor(2048, 1, 1);

      recorder.onaudioprocess = function(e){
        if(!recording) return;
        var left = e.inputBuffer.getChannelData(0);
        // var right = e.inputBuffer.getChannelData(1);
        detectSound(left);
      };

      volume.connect(recorder);// connect the recorder
      recorder.connect(audioContext.destination);
    },

    function(){ //failure
      alert('Error capturing audio.');
    });

  } else {
    alert('getUserMedia not supported in this browser.');
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
    }else{
      moveY -= 10;
    }
  }

  return false;
};

let socket = io('http://localhost:3000');

const log = (message) => {
  let $el = $('<li>').addClass('log').text(message);
  $('.users').append($el);
};

const cleanInput = (input) => {
  return $('<div/>').text(input).text();
};

const setUsername = () => {
  username = cleanInput($usernameInput.val().trim());

  if (username) {
    $loginPage.fadeOut();
    $gamepage.show();
    gamepage();
    $loginPage.off('click');
    socket.emit('add user', username);
  }
};

const addParticipantsMessage = (data) => {
  var message = '';
  if (data.numUsers === 1) {
    message += 'there`s 1 participant';
  } else {
    message += 'there are ' + data.numUsers + ' participants';
  }
  console.log(message);
};


const detectClap = data => {
  var t = (new Date()).getTime();
  if(t - lastClap < 200) return false; // TWEAK HERE
  var zeroCrossings = 0, highAmp = 0;
  for(var i = 1; i < data.length; i++){
    if(Math.abs(data[i]) > 0.25) highAmp++; // TWEAK HERE
    if(data[i] > 0 && data[i-1] < 0 || data[i] < 0 && data[i-1] > 0) zeroCrossings++;
  }
  if(highAmp > 20 && zeroCrossings > 30){ // TWEAK HERE
    lastClap = t;
    _clapY = highAmp;
    return true;
  }
  drisgeklapt = false;
  return false;
};



$window.keydown(function (event) {
  if (!(event.ctrlKey || event.metaKey || event.altKey)) {
    $currentInput.focus();
  }

  if (event.which === 13) {
    if (!username) {
      setUsername();
    }
  }
});


const init = () => {

  socket.on('login', data => {
    connected = true;
    console.log(data);
    var message = 'Welcome to HamsterSound';
    log(message, {
      prepend: true
    });
  });

  socket.on('user joined', data => {
    log(`${data.username} joined`);
    console.log(data.username);
  });

  socket.on('user left', data => {
    log(`${data.username} left`);
    addParticipantsMessage(data);
  });


};


init();
