'use strict';
// import {html} from './helpers/util';
import {MathUtil} from './modules/util/';
import BlueGate from './modules/render/BlueGate';
import RedGate from './modules/render/RedGate';
import {html} from './helpers/util';

/////////////SOCKET NODE USER SMARTPHONE/////////////
/////////////SOCKET NODE USER SMARTPHONE/////////////
/////////////SOCKET NODE USER SMARTPHONE/////////////


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
let key = "", animationTimeout;


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


  let spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load('../assets/nodemon.png'),
    color: '#ffffff', transparent: false, blending: THREE.AdditiveBlending
  });

  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(50, 50, 1.0);
  circle.add(sprite);

  renderer.setClearColor('#010322', 1);

  player();
  blue();
  red();
  sound();


};


const red = () => {
  scene.add(redGate._initRed());
};


const blue = () => {
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
    }else{
      moveY -= 10;
    }
  }

  return false;
};



const init = () => {

  if(Modernizr.touch) {
    console.log("mobile");
    $.get('/components/mobile.html', _mobile.bind(this));
  } else {
    console.log('desktop');
    $.get('/components/desktop.html', _desktop.bind(this));
  }


  socket.on('user left', data => {
    log(`${data.username} left`);
    addParticipantsMessage(data);
  });

  socket.on('drisgedrukt', data => {
    gamepage();
    $('.start-desktop').hide();

    // console.log(data);
    // let circle = new THREE.Mesh(geometry, material);
    // scene.add(circle);
    // circle.position.x = moveX;
    // circle.position.y = moveY;
    // circle.rotation.x -= 0.05;
    // circle.rotation.y = -1;
  });


};

///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////
///////////////////SOCKET/////////////////


const _desktop = htmlCode => {
  $('body').append($(htmlCode));
};

const _mobile = htmlCode => {
    $('body').append($(htmlCode));

    $(".button :submit").click(function(e) {
      e.preventDefault();
      socket.emit('knopgedrukt', 'mobile');
      $('.start-mobile').hide();
    });


    $(".knop :submit").click(function(e) {
      e.preventDefault();
      console.log('knop');
    });


};




























init();
