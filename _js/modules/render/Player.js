'use strict';


import EventEmitter from 'eventemitter2';

export default class Player extends EventEmitter {

  constructor(socket, playersocketid, color){
    super();
    this.socket = socket;

    let volume;
    let audioInput;
    let recorder;
    let recording = true;


    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    let lastClap = (new Date()).getTime();


    this.playersocketid = playersocketid;
    this.positionX = 0;
    this.positionY = 0;
    this.color = color;

    // console.log(this.playersocketid);
    // console.log(this.color);
    // console.log(this.positionX);
    // console.log(this.positionY);


    this.render();


  }

  sound(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if(navigator.getUserMedia){

      navigator.getUserMedia({
        audio: true
      },

      e => {

        this.volume = this.audioContext.createGain(); // creates a gain node
        this.audioInput = this.audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream
        this.audioInput.connect(this.volume);// connect the stream to the gain node
        this.recorder = this.audioContext.createScriptProcessor(2048, 1, 1);

        this.recorder.onaudioprocess = b =>{

          let left = b.inputBuffer.getChannelData(0);
          this.detectSound(left);
        };

        this.volume.connect(this.recorder);// connect the recorder
        this.recorder.connect(this.audioContext.destination);
      },
      () => { //failure
        let customAlert;
        customAlert('Error capturing audio.');
      });

    } else {
      let customAlert;
      customAlert('getUserMedia not supported in this browser.');
    }
  }

  _onFrame(){

    let x = this.positionX;
    let y = this.positionY;


    this.positionX += 5;
    this.positionY += 0;


    this.circle.position.x = x;
    this.circle.position.y = y;

    requestAnimationFrame(() => this._onFrame());
  }

  render(){
    let x = this.positionX;
    let y = this.positionY;
    let color = this.color;

    let material = new THREE.MeshBasicMaterial({color: color});
    var geometry = new THREE.CircleGeometry(30, 1);
    let circle = new THREE.Mesh(geometry, material);
    this.circle = circle;

    let spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('../assets/image/nodemon.png'),
      color: color, transparent: true, blending: THREE.AdditiveBlending
    });

    let sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(75, 75, 1.0);
    circle.add(sprite);

    circle.position.x = x;
    circle.position.y = y;
    this._onFrame();

    this.sound();

    return circle;

  }

  _initPlayer(speed){
    this.color = 0x0000FF;
    this.speed = speed;
    return this.render();
  }

  getSocketId(){
    return this.playersocketid;
  }

  isMovingWithId(){

    return this.positionY;
  }

  detectSound(data){

    let t = (new Date()).getTime(); //krijg tijd binnen
    if(t - this.lastClap < 10) return false;

    let zeroCrossings = 0, highAmp = 0;
    for(let i = 1; i < data.length; i++){
      if(Math.abs(data[i]) > 0.25) highAmp++;
      if(data[i] > 0 && data[i-1] < 0 || data[i] < 0 && data[i-1] > 0) zeroCrossings++;
    }

    if(highAmp > 20){
      this.upY();
    }else{
      this.downY();
    }
    return false;

  }


  upY(){
    this.positionY += 15;
    this.socket.emit('upY', this.positionY);
  }

  downY(){
    this.positionY -= 15;
    this.socket.emit('downY', this.positionY);
  }

}


