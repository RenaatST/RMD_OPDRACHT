'use strict';
let $window = $(window);
let $usernameInput = $('.usernameInput');
let socket;
let socketid;
let $loginPage = $('.login.page'); // The login page
let username;
let connected = false;
let $currentInput = $usernameInput.focus();


/*
let recorder = null;
let recording = true;
let audioInput = null;
let volume = null;
let audioContext = null;
let lastClap = (new Date()).getTime();
let drisgeklapt = false;
let _clapY = null;
*/

$window.keydown(function (event) {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }

    if (event.which === 13) {
        setUsername();
    }
});


const cleanInput = (input) => {
    return $('<div/>').text(input).text();
};

const addMessageElement = (el, options) => {
  var $el = $(el);

  // Setup default options
  if (!options) {
    options = {};
  }
  if (typeof options.fade === 'undefined') {
    options.fade = true;
  }
  if (typeof options.prepend === 'undefined') {
    options.prepend = false;
  }

  // Apply options
  if (options.fade) {
    $el.hide().fadeIn(FADE_TIME);
  }
  if (options.prepend) {
    $messages.prepend($el);
  } else {
    $messages.append($el);
  }
  $messages[0].scrollTop = $messages[0].scrollHeight;
};

const setUsername = () => {
    username = cleanInput($usernameInput.val().trim());

    if (username) {
      console.log("username");
      $loginPage.fadeOut();
      $loginPage.off('click');
      socket.emit('add user', username);
    }
;}

const log = (message) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
};

const init = () => {

  socket = io('http://localhost:3000');

  socket.on('login', function (data) {
    connected = true;
    var message = "Welcome to HamsterSound– ";
    log("message", message);
  });

  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    log("data", data);
  });

  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

/*
  let canvas = document.getElementById("test");
  let ctx = canvas.getContext("2d");
  var count = 0;
  var start_x = 0;
  var start_y = 100;
  var end_x = 10000;
  var end_y = 10000;

  var counter = setInterval(countNumbers, 100);

  ctx.beginPath();
  ctx.moveTo(start_x, start_y);
  console.log("Start");
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  function countNumbers(){
    count += 1;
    ctx.lineTo((start_x + count), _clapY);

    navigator.getUserMedia = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if(navigator.getUserMedia){

      navigator.getUserMedia({
        audio:true
      },

      function(e){

          var AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContext = new AudioContext();
          volume = audioContext.createGain(); // creates a gain node
          audioInput = audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream
          audioInput.connect(volume);// connect the stream to the gain node
          recorder = audioContext.createScriptProcessor(2048, 1, 1);

          recorder.onaudioprocess = function(e){
              if(!recording) return;
              var left = e.inputBuffer.getChannelData(0);
              //var right = e.inputBuffer.getChannelData(1);
              detectClap(left);
          };
          volume.connect(recorder);// connect the recorder
          recorder.connect(audioContext.destination);
        },
        function(e){ //failure
          alert('Error capturing audio.');
        }
      );
    } else {
      alert('getUserMedia not supported in this browser.');
    }
    let lastClap = (new Date()).getTime();

    ctx.stroke();
    console.log(count);
    if(start_x === end_x){
      clearInterval(counter);
      console.log("End");
    }
  }
*/
};
/*
const detectClap = data => {

  var t = (new Date()).getTime();
  if(t - lastClap < 200) return false; // TWEAK HERE
    var zeroCrossings = 0, highAmp = 0;
  for(var i = 1; i < data.length; i++){
    if(Math.abs(data[i]) > 0.25) highAmp++; // TWEAK HERE
    if(data[i] > 0 && data[i-1] < 0 || data[i] < 0 && data[i-1] > 0) zeroCrossings++;
  }

  if(highAmp > 20 && zeroCrossings > 30){ // TWEAK HERE
    console.log(highAmp+' / '+zeroCrossings);
    lastClap = t;
    _clapY = highAmp;

    return true;
  }

  drisgeklapt = false;
  return false;
};
*/


init();
