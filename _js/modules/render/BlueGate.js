'use strict';

import EventEmitter from 'eventemitter2';
import {MathUtil, SoundUtil} from '../util/';

export default class BlueGate extends EventEmitter {

  constructor(position, rotation){
    super();

    this.position = position;
    this.rotation = rotation;
    this._onFrame();
  }

  _onFrame(){
    let {x, y, z} = this.position;

    this.position.x = 5000;
    this.position.y = 0;
    this.position.z = 0;

    requestAnimationFrame(() => this._onFrame());
  }



  render(){
    let {x, y, z} = this.position;
    let {color} = this;
    let {rotation} = this;
    let radius = 300;
    var geometry = new THREE.TorusGeometry( radius, 50, 20, 5 );
    let material = new THREE.MeshBasicMaterial({ color: color, wireframe: true});
    let cube = new THREE.Mesh(geometry, material);
    this.cube = cube;

    let spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.ImageUtils.loadTexture( '../assets/nodemon.png'),
      useScreenCoordinates: false,
      color: color, transparent: true, blending: THREE.AdditiveBlending
    });

    let sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(500, 500, 1.0);
    cube.add(sprite);


    cube.rotation.y = 80;
    cube.position.x = x;
    cube.position.z = z;
    return cube;
  }


  _hitBlue(){
    this.color = 0x949955;
    return this.render();
  }

  _initBlue(rotation){
    this.color = 0x0000FF;
    return this.render();
  }




}



