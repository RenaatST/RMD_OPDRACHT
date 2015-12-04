/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(2);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("'use strict';\nvar $window = $(window);\nvar $usernameInput = $('.usernameInput');\nvar socket = undefined;\nvar socketid = undefined;\nvar $loginPage = $('.login.page'); // The login page\nvar username = undefined;\nvar connected = false;\nvar $currentInput = $usernameInput.focus();\n\n/*\nlet recorder = null;\nlet recording = true;\nlet audioInput = null;\nlet volume = null;\nlet audioContext = null;\nlet lastClap = (new Date()).getTime();\nlet drisgeklapt = false;\nlet _clapY = null;\n*/\n\n$window.keydown(function (event) {\n  if (!(event.ctrlKey || event.metaKey || event.altKey)) {\n    $currentInput.focus();\n  }\n\n  if (event.which === 13) {\n    setUsername();\n  }\n});\n\nvar cleanInput = function cleanInput(input) {\n  return $('<div/>').text(input).text();\n};\n\nvar addMessageElement = function addMessageElement(el, options) {\n  var $el = $(el);\n\n  // Setup default options\n  if (!options) {\n    options = {};\n  }\n  if (typeof options.fade === 'undefined') {\n    options.fade = true;\n  }\n  if (typeof options.prepend === 'undefined') {\n    options.prepend = false;\n  }\n\n  // Apply options\n  if (options.fade) {\n    $el.hide().fadeIn(FADE_TIME);\n  }\n  if (options.prepend) {\n    $messages.prepend($el);\n  } else {\n    $messages.append($el);\n  }\n  $messages[0].scrollTop = $messages[0].scrollHeight;\n};\n\nvar setUsername = function setUsername() {\n  username = cleanInput($usernameInput.val().trim());\n\n  if (username) {\n    console.log(\"username\");\n    $loginPage.fadeOut();\n    $loginPage.off('click');\n    socket.emit('add user', username);\n  }\n  ;\n};\n\nvar log = function log(message) {\n  var $el = $('<li>').addClass('log').text(message);\n  addMessageElement($el, options);\n};\n\nvar init = function init() {\n\n  socket = io('http://localhost:3000');\n\n  socket.on('login', function (data) {\n    connected = true;\n    var message = \"Welcome to HamsterSound– \";\n    log(\"message\", message);\n  });\n\n  socket.on('user joined', function (data) {\n    log(data.username + ' joined');\n    log(\"data\", data);\n  });\n\n  socket.on('user left', function (data) {\n    log(data.username + ' left');\n    addParticipantsMessage(data);\n    removeChatTyping(data);\n  });\n\n  /*\n    let canvas = document.getElementById(\"test\");\n    let ctx = canvas.getContext(\"2d\");\n    var count = 0;\n    var start_x = 0;\n    var start_y = 100;\n    var end_x = 10000;\n    var end_y = 10000;\n  \n    var counter = setInterval(countNumbers, 100);\n  \n    ctx.beginPath();\n    ctx.moveTo(start_x, start_y);\n    console.log(\"Start\");\n    ctx.lineWidth = 2;\n    ctx.strokeStyle = \"black\";\n  \n    function countNumbers(){\n      count += 1;\n      ctx.lineTo((start_x + count), _clapY);\n  \n      navigator.getUserMedia = navigator.getUserMedia    || navigator.webkitGetUserMedia ||\n                           navigator.mozGetUserMedia || navigator.msGetUserMedia;\n  \n      if(navigator.getUserMedia){\n  \n        navigator.getUserMedia({\n          audio:true\n        },\n  \n        function(e){\n  \n            var AudioContext = window.AudioContext || window.webkitAudioContext;\n            audioContext = new AudioContext();\n            volume = audioContext.createGain(); // creates a gain node\n            audioInput = audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream\n            audioInput.connect(volume);// connect the stream to the gain node\n            recorder = audioContext.createScriptProcessor(2048, 1, 1);\n  \n            recorder.onaudioprocess = function(e){\n                if(!recording) return;\n                var left = e.inputBuffer.getChannelData(0);\n                //var right = e.inputBuffer.getChannelData(1);\n                detectClap(left);\n            };\n            volume.connect(recorder);// connect the recorder\n            recorder.connect(audioContext.destination);\n          },\n          function(e){ //failure\n            alert('Error capturing audio.');\n          }\n        );\n      } else {\n        alert('getUserMedia not supported in this browser.');\n      }\n      let lastClap = (new Date()).getTime();\n  \n      ctx.stroke();\n      console.log(count);\n      if(start_x === end_x){\n        clearInterval(counter);\n        console.log(\"End\");\n      }\n    }\n  */\n};\n/*\nconst detectClap = data => {\n\n  var t = (new Date()).getTime();\n  if(t - lastClap < 200) return false; // TWEAK HERE\n    var zeroCrossings = 0, highAmp = 0;\n  for(var i = 1; i < data.length; i++){\n    if(Math.abs(data[i]) > 0.25) highAmp++; // TWEAK HERE\n    if(data[i] > 0 && data[i-1] < 0 || data[i] < 0 && data[i-1] > 0) zeroCrossings++;\n  }\n\n  if(highAmp > 20 && zeroCrossings > 30){ // TWEAK HERE\n    console.log(highAmp+' / '+zeroCrossings);\n    lastClap = t;\n    _clapY = highAmp;\n\n    return true;\n  }\n\n  drisgeklapt = false;\n  return false;\n};\n*/\n\ninit();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/script.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/script.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_scss/style.scss\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_scss/style.scss?");

/***/ }
/******/ ]);