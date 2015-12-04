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

	eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(4);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _helpersUtil = __webpack_require__(2);\n\nvar $usernameInput = (0, _helpersUtil.$)('.usernameInput');\nvar socket = undefined;\nvar socketid = undefined;\nvar $loginPage = (0, _helpersUtil.$)('.login.page'); // The login page\nvar username = undefined;\nvar users = [];\nvar connected = false;\nvar $currentInput = $usernameInput.focus();\nvar $messages = (0, _helpersUtil.$)('.users'); // Messages area\n\n/*\nlet recorder = null;\nlet recording = true;\nlet audioInput = null;\nlet volume = null;\nlet audioContext = null;\nlet lastClap = (new Date()).getTime();\nlet drisgeklapt = false;\nlet _clapY = null;\n*/\n/*\n$('window').keydown(function (event) {\n    if (!(event.ctrlKey || event.metaKey || event.altKey)) {\n      $currentInput.focus();\n    }\n\n    if (event.which === 13) {\n        setUsername();\n    }\n});\n*/\n\nvar cleanInput = function cleanInput(input) {\n  return (0, _helpersUtil.$)('<div/>').text(input).text();\n};\n\nvar addMessageElement = function addMessageElement(el) {\n  var $el = (0, _helpersUtil.$)(el);\n  $messages.append($el);\n};\n\nvar setUsername = function setUsername() {\n  username = cleanInput($usernameInput.val().trim());\n\n  if (username) {\n    console.log(username);\n    $loginPage.fadeOut();\n    $loginPage.off('click');\n    socket.emit('add user', username);\n  }\n  ;\n};\n\nvar log = function log(message) {\n  var $el = (0, _helpersUtil.$)('<li>').addClass('log').text(message);\n  addMessageElement($el);\n};\n\nvar init = function init() {\n\n  var users = (0, _helpersUtil.$)('.users');\n\n  socket = io('http://localhost:3000');\n\n  socket.on('user joined', function (client) {\n    var $el = (0, _helpersUtil.html)(client);\n    users.appendChild($el);\n  });\n\n  socket.on('user left', function (data) {\n    //log(data.username + ' left');\n    addParticipantsMessage(data);\n    removeChatTyping(data);\n  });\n\n  socket.on('login', function (data) {\n    connected = true;\n    var message = 'Welcome to HamsterSound!';\n    log(message);\n  });\n\n  /*\n    let canvas = document.getElementById(\"test\");\n    let ctx = canvas.getContext(\"2d\");\n    var count = 0;\n    var start_x = 0;\n    var start_y = 100;\n    var end_x = 10000;\n    var end_y = 10000;\n  \n    var counter = setInterval(countNumbers, 100);\n  \n    ctx.beginPath();\n    ctx.moveTo(start_x, start_y);\n    console.log(\"Start\");\n    ctx.lineWidth = 2;\n    ctx.strokeStyle = \"black\";\n  \n    function countNumbers(){\n      count += 1;\n      ctx.lineTo((start_x + count), _clapY);\n  \n      navigator.getUserMedia = navigator.getUserMedia    || navigator.webkitGetUserMedia ||\n                           navigator.mozGetUserMedia || navigator.msGetUserMedia;\n  \n      if(navigator.getUserMedia){\n  \n        navigator.getUserMedia({\n          audio:true\n        },\n  \n        function(e){\n  \n            var AudioContext = window.AudioContext || window.webkitAudioContext;\n            audioContext = new AudioContext();\n            volume = audioContext.createGain(); // creates a gain node\n            audioInput = audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream\n            audioInput.connect(volume);// connect the stream to the gain node\n            recorder = audioContext.createScriptProcessor(2048, 1, 1);\n  \n            recorder.onaudioprocess = function(e){\n                if(!recording) return;\n                var left = e.inputBuffer.getChannelData(0);\n                //var right = e.inputBuffer.getChannelData(1);\n                detectClap(left);\n            };\n            volume.connect(recorder);// connect the recorder\n            recorder.connect(audioContext.destination);\n          },\n          function(e){ //failure\n            alert('Error capturing audio.');\n          }\n        );\n      } else {\n        alert('getUserMedia not supported in this browser.');\n      }\n      let lastClap = (new Date()).getTime();\n  \n      ctx.stroke();\n      console.log(count);\n      if(start_x === end_x){\n        clearInterval(counter);\n        console.log(\"End\");\n      }\n    }\n  */\n};\n/*\nconst detectClap = data => {\n\n  var t = (new Date()).getTime();\n  if(t - lastClap < 200) return false; // TWEAK HERE\n    var zeroCrossings = 0, highAmp = 0;\n  for(var i = 1; i < data.length; i++){\n    if(Math.abs(data[i]) > 0.25) highAmp++; // TWEAK HERE\n    if(data[i] > 0 && data[i-1] < 0 || data[i] < 0 && data[i-1] > 0) zeroCrossings++;\n  }\n\n  if(highAmp > 20 && zeroCrossings > 30){ // TWEAK HERE\n    console.log(highAmp+' / '+zeroCrossings);\n    lastClap = t;\n    _clapY = highAmp;\n\n    return true;\n  }\n\n  drisgeklapt = false;\n  return false;\n};\n*/\n\ninit();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/script.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/script.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }\n\n__webpack_require__(3);\n\nvar html = function html(strings) {\n  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    values[_key - 1] = arguments[_key];\n  }\n\n  var str = '';\n\n  if (Array.isArray(strings)) {\n    for (var i = 0; i < strings.length; i++) {\n      if (strings[i]) str += strings[i];\n      if (values[i]) str += values[i];\n    }\n  } else {\n    str = strings;\n  }\n\n  var doc = new DOMParser().parseFromString(str.trim(), 'text/html');\n\n  return doc.body.firstChild;\n};\n\nexports.html = html;\nvar prepend = function prepend($parent, $element) {\n  var $first = $parent.children[0];\n  $parent.insertBefore($element, $first);\n};\n\nexports.prepend = prepend;\nvar $ = function $(selector) {\n\n  var result = undefined;\n\n  if (selector === 'body') {\n    return document.body;\n  } else if (selector === 'head') {\n    return document.head;\n  } else if (/^[\\#.]?[\\w-]+$/.test(selector)) {\n\n    if (selector[0] === '#') {\n      return document.getElementById(selector.slice(1));\n    } else if (selector[0] === '.') {\n      result = document.getElementsByClassName(selector.slice(1));\n    } else {\n      result = document.getElementsByTagName(selector);\n    }\n  } else {\n    result = document.querySelectorAll(selector);\n  }\n\n  var elements = [].concat(_toConsumableArray(result));\n  if (elements.length === 1) return elements[0];\n  return elements;\n};\nexports.$ = $;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/helpers/util.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/helpers/util.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("/*! http://mths.be/array-from v0.2.0 by @mathias */\nif (!Array.from) {\n\t(function() {\n\t\t'use strict';\n\t\tvar defineProperty = (function() {\n\t\t\t// IE 8 only supports `Object.defineProperty` on DOM elements.\n\t\t\ttry {\n\t\t\t\tvar object = {};\n\t\t\t\tvar $defineProperty = Object.defineProperty;\n\t\t\t\tvar result = $defineProperty(object, object, object) && $defineProperty;\n\t\t\t} catch(error) {}\n\t\t\treturn result || function put(object, key, descriptor) {\n\t\t\t\tobject[key] = descriptor.value;\n\t\t\t};\n\t\t}());\n\t\tvar toStr = Object.prototype.toString;\n\t\tvar isCallable = function(fn) {\n\t\t\t// In a perfect world, the `typeof` check would be sufficient. However,\n\t\t\t// in Chrome 1–12, `typeof /x/ == 'object'`, and in IE 6–8\n\t\t\t// `typeof alert == 'object'` and similar for other host objects.\n\t\t\treturn typeof fn == 'function' || toStr.call(fn) == '[object Function]';\n\t\t};\n\t\tvar toInteger = function(value) {\n\t\t\tvar number = Number(value);\n\t\t\tif (isNaN(number)) {\n\t\t\t\treturn 0;\n\t\t\t}\n\t\t\tif (number == 0 || !isFinite(number)) {\n\t\t\t\treturn number;\n\t\t\t}\n\t\t\treturn (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));\n\t\t};\n\t\tvar maxSafeInteger = Math.pow(2, 53) - 1;\n\t\tvar toLength = function(value) {\n\t\t\tvar len = toInteger(value);\n\t\t\treturn Math.min(Math.max(len, 0), maxSafeInteger);\n\t\t};\n\t\tvar from = function(arrayLike) {\n\t\t\tvar C = this;\n\t\t\tif (arrayLike == null) {\n\t\t\t\tthrow new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');\n\t\t\t}\n\t\t\tvar items = Object(arrayLike);\n\t\t\tvar mapping = arguments.length > 1;\n\n\t\t\tvar mapFn, T;\n\t\t\tif (arguments.length > 1) {\n\t\t\t\tmapFn = arguments[1];\n\t\t\t\tif (!isCallable(mapFn)) {\n\t\t\t\t\tthrow new TypeError('When provided, the second argument to `Array.from` must be a function');\n\t\t\t\t}\n\t\t\t\tif (arguments.length > 2) {\n\t\t\t\t\tT = arguments[2];\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tvar len = toLength(items.length);\n\t\t\tvar A = isCallable(C) ? Object(new C(len)) : new Array(len);\n\t\t\tvar k = 0;\n\t\t\tvar kValue, mappedValue;\n\t\t\twhile (k < len) {\n\t\t\t\tkValue = items[k];\n\t\t\t\tif (mapFn) {\n\t\t\t\t\tmappedValue = typeof T == 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);\n\t\t\t\t} else {\n\t\t\t\t\tmappedValue = kValue;\n\t\t\t\t}\n\t\t\t\tdefineProperty(A, k, {\n\t\t\t\t\t'value': mappedValue,\n\t\t\t\t\t'configurable': true,\n\t\t\t\t\t'enumerable': true\n\t\t\t\t});\n\t\t\t\t++k;\n\t\t\t}\n\t\t\tA.length = len;\n\t\t\treturn A;\n\t\t};\n\t\tdefineProperty(Array, 'from', {\n\t\t\t'value': from,\n\t\t\t'configurable': true,\n\t\t\t'writable': true\n\t\t});\n\t}());\n}\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/array.from/array-from.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/array.from/array-from.js?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_scss/style.scss\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_scss/style.scss?");

/***/ }
/******/ ]);