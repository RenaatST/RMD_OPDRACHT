'use strict';


import EventEmitter from 'eventemitter2';

export default class RedGate extends EventEmitter {

  constructor(position){
    super();

    this.position = position;

    this._onFrame();
  }

  _onFrame(){
    let {x, y, z} = this.position;
    z = 0;

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    requestAnimationFrame(() => this._onFrame());
  }

  render(){
    let {x, y, z} = this.position;
    let {color} = this;

    let geometry = new THREE.BoxGeometry(100, window.innerHeight*2, 1);
    let material = new THREE.MeshBasicMaterial({ color: color});
    let cube = new THREE.Mesh(geometry, material);
    this.cube = cube;

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;

  }

  _hitRed(){
    this.color = '#DDFFFC';
    return this.render();
  }

  _initRed(posX, posY){
    this.color = '#CA473E';
    this.position.x = posX;
    this.position.y = posY;

    return this.render();
  }

  _switch(){
    this.color = 0x0000FF;
    return this.render();
  }




}

