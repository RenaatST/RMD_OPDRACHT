'use strict';


import EventEmitter from 'eventemitter2';

export default class Player extends EventEmitter {



  constructor(socket, playersocketid, desktopsocketid, color){
    super();
    this.socket = socket;


    this.playersocketid = playersocketid;
    this.desktopsocketid = desktopsocketid;
    this.positionX = -100;
    this.positionY = 100;
    this.color = color;



    this.render();
  }


  _onFrame(){

    let x = this.positionX;
    let y = this.positionY;


    this.positionX += 18;


    this.circle.position.x = x;
    this.circle.position.y = y;



    requestAnimationFrame(() => this._onFrame());
  }

  render(){
    let x = this.positionX;
    let y = this.positionY;
    let color = this.color;

    let material = new THREE.MeshBasicMaterial({color: color});
    var geometry = new THREE.CircleGeometry(50, 50);
    let circle = new THREE.Mesh(geometry, material);
    this.circle = circle;


    circle.position.x = x;
    circle.position.y = y;

    this._onFrame();


    return circle;

  }


  getSocketId(){
    return this.playersocketid;
  }

  getDesktopSocketId(){
    return this.desktopsocketid;
  }

}


