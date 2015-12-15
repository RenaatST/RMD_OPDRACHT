'use strict';


import EventEmitter from 'eventemitter2';

export default class Player extends EventEmitter {

  constructor(playersocketid, positionX, positionY ){
    super();

    this.playersocketid = playersocketid;
    this.positionX = positionX;
    this.positionY = positionY;

    console.log(playersocketid);
    console.log(positionX);
    console.log(positionY);

    this.render();


  }

  _onFrame(){

    //let {x, y, z} = this.position;
    let x = this.positionX;
    let y = this.positionY;

    this.positionX += 2;
    this.positionY += 2;


    this.circle.position.x = x;
    this.circle.position.y = y;

    // this.circle.position.x = x;
    // this.circle.position.y = y;
    // this.circle.position.z = z;


    requestAnimationFrame(() => this._onFrame());
  }

  render(){
    let x = this.positionX;
    let y = this.positionY;


    let material = new THREE.MeshBasicMaterial({color: 0x0000FF});
    var geometry = new THREE.CircleGeometry(30, 1);
    let circle = new THREE.Mesh(geometry, material);
    this.circle = circle;

    let spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('../assets/image/nodemon.png'),
      color: 0x0000FF, transparent: true, blending: THREE.AdditiveBlending
    });

    let sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(75, 75, 1.0);
    circle.add(sprite);

    circle.position.x = x;
    circle.position.y = y;
    this._onFrame();

    return circle;

  }

  _initPlayer(speed){
    this.color = 0x0000FF;
    this.speed = speed;
    return this.render();
  }

}
