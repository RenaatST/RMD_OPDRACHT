'use strict';

import EventEmitter from 'eventemitter2';

export default class BlueGate extends EventEmitter {

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

  _hitBlue(){
    this.color = '#DDFFFC';
    return this.render();
  }

  _initBlue(posX, posY2){
    this.color = 0x0000FF;
    this.position.x = posX;
    this.position.y = posY2;
    return this.render();
  }

  _switch(){
    console.log('cool');
    this.color = '#0D0621';
    return this.render();
  }


}



