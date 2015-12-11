'use strict';

import EventEmitter from 'eventemitter2';

export default class BlueGate extends EventEmitter {

  constructor(position){
    super();

    this.position = position;
    this._onFrame();
  }

  _onFrame(){

    this.position.x = 5000;
    this.position.y = 0;
    this.position.z = 0;

    requestAnimationFrame(() => this._onFrame());
  }



  render(){
    let {x, y, z} = this.position;
    let {color} = this;

    let radius = 300;
    var geometry = new THREE.TorusGeometry( radius, 50, 20, 20 );
    let material = new THREE.MeshBasicMaterial({ color: color});
    let cube = new THREE.Mesh(geometry, material);
    this.cube = cube;

    cube.rotation.y = 80;

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    return cube;
  }


  _hitBlue(){
    this.color = 0x949955;
    return this.render();
  }

  _initBlue(){
    this.color = 0x0000FF;
    return this.render();
  }




}



