'use strict';

import {html} from './helpers/util';

let $window = $(window);
let $usernameInput = $('.usernameInput');
let $loginPage = $('.login.page');
let $gamepage = $('.game.page');
let username;
let connected;
let $currentInput = $usernameInput.focus();

let recorder = null;
let recording = true;
let audioInput = null;
let volume = null;
let audioContext = null;
let lastClap = (new Date()).getTime();
let drisgeklapt;
let _clapY = null;


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

const gamepage = () => {
  let canvas = document.getElementById('test');
  let ctx = canvas.getContext('2d');
  var count = 0;
  var startX = 0;
  var startY = 100;
  var endX = 10000;
  var counter = setInterval(countNumbers, 100);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  console.log('Start');
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  function countNumbers(){
    count += 1;
    ctx.lineTo((startX + count), _clapY);
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if(navigator.getUserMedia){
      navigator.getUserMedia({
        audio: true
      },

    function(e){
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      volume = audioContext.createGain(); // creates a gain node
      audioInput = audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream
      audioInput.connect(volume);// connect the stream to the gain node
      recorder = audioContext.createScriptProcessor(2048, 1, 1);
      recorder.onaudioprocess = function(){
        if(!recording) return;
        var left = e.inputBuffer.getChannelData(0);
        //var right = e.inputBuffer.getChannelData(1);
        detectClap(left);
      };
      volume.connect(recorder);// connect the recorder
      recorder.connect(audioContext.destination);
    },

      () => { //failure
        console.log('Error capturing audio.');
      }
    );
    } else {
      console.log('getUserMedia not supported in this browser.');
    }
    lastClap = (new Date()).getTime();
    ctx.stroke();
    console.log(count);
    if(startX === endX){
      clearInterval(counter);
      console.log('End');
    }
  }


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
