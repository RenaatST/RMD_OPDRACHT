'use strict';

import {MathUtil, SoundUtil} from '../util/';

import EventEmitter from 'eventemitter2';
export default class Circle extends EventEmitter {

  constructor(position){
    super();

    // this.type = type;
    this.position = position;
    // this.highAmp = highAmp;

    this._initMoving();
    this._onFrame();
  }

  _onFrame(){

    let {speed, target, highAmp} = this;
    let {x, y, z} = this.position;

    this.position.x = 200;
    this.position.y = 200;
    this.position.z = 0;

    this.obj.position.x = this.position.x;
    this.obj.position.y = this.position.y;
    this.obj.position.z = this.position.z;

    requestAnimationFrame(() => this._onFrame());

  }

  render(){

    let {x, y, z} = this;
    let {radius, fill} = this;

    let geometry = new THREE.SphereGeometry(radius, 100, 100);

    let material = new THREE.MeshBasicMaterial({
      color: fill,
      wireframe: true
    });

    let shape = new THREE.Mesh(geometry, material);

    shape.position.x = x;
    shape.position.y = y;
    shape.position.z = z;

    this.obj = shape;

    return this.obj;

  }

  _initMoving(){

    this.radius = 2;

    this.effect = SoundUtil.randomEffect();
    this.fill = 'yellow';

    this.speed = 10;

  }






}

Circle.MOVING = 'moving';
Circle.FIXED = 'fixed';
