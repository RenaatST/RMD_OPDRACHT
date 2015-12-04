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

	eval("'use strict';\n\nvar _helpersUtil = __webpack_require__(2);\n\nvar $window = $(window);\nvar $usernameInput = $('.usernameInput');\nvar $loginPage = $('.login.page');\nvar $gamepage = $('.game.page');\nvar username = undefined;\nvar connected = undefined;\nvar $currentInput = $usernameInput.focus();\n\nvar recorder = null;\nvar recording = true;\nvar audioInput = null;\nvar volume = null;\nvar audioContext = null;\nvar lastClap = new Date().getTime();\nvar drisgeklapt = undefined;\nvar _clapY = null;\n\nvar socket = io('http://localhost:3000');\n\nvar log = function log(message) {\n  var $el = $('<li>').addClass('log').text(message);\n  $('.users').append($el);\n};\n\nvar cleanInput = function cleanInput(input) {\n  return $('<div/>').text(input).text();\n};\n\nvar setUsername = function setUsername() {\n  username = cleanInput($usernameInput.val().trim());\n\n  if (username) {\n    $loginPage.fadeOut();\n    $gamepage.show();\n    gamepage();\n    $loginPage.off('click');\n    socket.emit('add user', username);\n  }\n};\n\nvar addParticipantsMessage = function addParticipantsMessage(data) {\n  var message = '';\n  if (data.numUsers === 1) {\n    message += 'there`s 1 participant';\n  } else {\n    message += 'there are ' + data.numUsers + ' participants';\n  }\n  console.log(message);\n};\n\nvar detectClap = function detectClap(data) {\n  var t = new Date().getTime();\n  if (t - lastClap < 200) return false; // TWEAK HERE\n  var zeroCrossings = 0,\n      highAmp = 0;\n  for (var i = 1; i < data.length; i++) {\n    if (Math.abs(data[i]) > 0.25) highAmp++; // TWEAK HERE\n    if (data[i] > 0 && data[i - 1] < 0 || data[i] < 0 && data[i - 1] > 0) zeroCrossings++;\n  }\n  if (highAmp > 20 && zeroCrossings > 30) {\n    // TWEAK HERE\n    lastClap = t;\n    _clapY = highAmp;\n    return true;\n  }\n  drisgeklapt = false;\n  return false;\n};\n\nvar gamepage = function gamepage() {\n  var canvas = document.getElementById('test');\n  var ctx = canvas.getContext('2d');\n  var count = 0;\n  var startX = 0;\n  var startY = 100;\n  var endX = 10000;\n  var counter = setInterval(countNumbers, 100);\n  ctx.beginPath();\n  ctx.moveTo(startX, startY);\n  console.log('Start');\n  ctx.lineWidth = 2;\n  ctx.strokeStyle = 'black';\n  function countNumbers() {\n    count += 1;\n    ctx.lineTo(startX + count, _clapY);\n    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;\n    if (navigator.getUserMedia) {\n      navigator.getUserMedia({\n        audio: true\n      }, function (e) {\n        var AudioContext = window.AudioContext || window.webkitAudioContext;\n        audioContext = new AudioContext();\n        volume = audioContext.createGain(); // creates a gain node\n        audioInput = audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream\n        audioInput.connect(volume); // connect the stream to the gain node\n        recorder = audioContext.createScriptProcessor(2048, 1, 1);\n        recorder.onaudioprocess = function () {\n          if (!recording) return;\n          var left = e.inputBuffer.getChannelData(0);\n          //var right = e.inputBuffer.getChannelData(1);\n          detectClap(left);\n        };\n        volume.connect(recorder); // connect the recorder\n        recorder.connect(audioContext.destination);\n      }, function () {\n        //failure\n        console.log('Error capturing audio.');\n      });\n    } else {\n      console.log('getUserMedia not supported in this browser.');\n    }\n    lastClap = new Date().getTime();\n    ctx.stroke();\n    console.log(count);\n    if (startX === endX) {\n      clearInterval(counter);\n      console.log('End');\n    }\n  }\n};\n\n$window.keydown(function (event) {\n  if (!(event.ctrlKey || event.metaKey || event.altKey)) {\n    $currentInput.focus();\n  }\n\n  if (event.which === 13) {\n    if (!username) {\n      setUsername();\n    }\n  }\n});\n\nvar init = function init() {\n\n  socket.on('login', function (data) {\n    connected = true;\n    console.log(data);\n    var message = 'Welcome to HamsterSound';\n    log(message, {\n      prepend: true\n    });\n  });\n\n  socket.on('user joined', function (data) {\n    log(data.username + ' joined');\n    console.log(data.username);\n  });\n\n  socket.on('user left', function (data) {\n    log(data.username + ' left');\n    addParticipantsMessage(data);\n  });\n};\n\ninit();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/script.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/script.js?");

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