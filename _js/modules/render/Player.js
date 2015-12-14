'use strict';


import EventEmitter from 'eventemitter2';

export default class Player extends EventEmitter {

  constructor(position){
    super();

    this.position = position;

    this._onFrame();
  }

  _onFrame(){


    if(this.move && this.type === Player.MOVING){
      let {x, y, z} = this.position;
      let {speed} = this;

      this.position.x = speed;
      this.position.y = 0;
      this.position.z = 0;

      this.circle.position.x = x;
      this.circle.position.y = y;
      this.circle.position.z = z;
    }

    requestAnimationFrame(() => this._onFrame());
  }

  render(){
    let {x, y, z} = this.position;
    let {color} = this;

    let material = new THREE.MeshBasicMaterial({color: color});
    var geometry = new THREE.CircleGeometry(30, 1);
    let circle = new THREE.Mesh(geometry, material);
    this.circle = circle;

    let spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('../assets/image/nodemon.png'),
      color: color, transparent: true, blending: THREE.AdditiveBlending
    });
    // var hamsterTexture = new THREE.TextureLoader().load('../assets/image/hamster.png');
    // var hamsterMaterial = new THREE.MeshBasicMaterial( { map: hamsterTexture, transparent: true } );
    // var hamster = new THREE.Mesh( geometry, hamsterMaterial );

    let sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(75, 75, 1.0);
    circle.add(sprite);

    circle.position.x = x;
    circle.position.y = y;
    circle.position.z = z;

    return circle;

  }

  _initPlayer(speed){
    this.color = 0x0000FF;
    this.speed = speed;
    return this.render();
  }


}

Player.MOVING = 'moving';
