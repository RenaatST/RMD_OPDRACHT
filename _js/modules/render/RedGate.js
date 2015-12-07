'use strict';

import {MathUtil} from '../util/';
import EventEmitter from 'eventemitter2';

export default class RedGate extends EventEmitter {

  constructor(position){
    super();

    this.position = position;

    this._onFrame();
  }

  _onFrame(){

    let {x, y, z} = this.position;

    this.position.x = 8000;
    this.position.y = 0;
    this.position.z = 0;


    requestAnimationFrame(() => this._onFrame());
  }

  render(){

    let {x, y, z} = this.position;
    let {color} = this;
    let radius = 300;

    let geometry = new THREE.TorusGeometry(radius, 50, 20, 5 );
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
    cube.position.y = y;
    cube.position.z = z;

    return cube;

  }

   _hitRed(){
    this.color = 0x949955;
    return this.render();
  }

  _initRed(){
    this.color = 0x990000;
    return this.render();
  }




}

