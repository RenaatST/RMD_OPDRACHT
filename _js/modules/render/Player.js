'use strict';


import EventEmitter from 'eventemitter2';

export default class Player extends EventEmitter {

  constructor(socket, playersocketid, desktopsocketid, color){
    super();
    this.socket = socket;

    this.playersocketid = playersocketid;
    this.desktopsocketid = desktopsocketid;
    this.positionX = 100;
    this.positionY = 100;
    this.color = color;

    console.log(this.playersocketid);
    console.log(this.desktopsocketid);
    this.render();
  }


  _onFrame(){

    let x = this.positionX;
    let y = this.positionY;


    this.positionX += 5;


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


    return circle;

  }

  getSocketId(){
    return this.playersocketid;
  }

}


