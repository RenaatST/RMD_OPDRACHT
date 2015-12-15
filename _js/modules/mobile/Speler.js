'use strict';


import EventEmitter from 'eventemitter2';

export default class Speler extends EventEmitter {

  constructor(socketid, color){
    super();
    this.socketid = socketid;
    this.color = color;

    console.log('dit is speler ' + this.socketid + ' met kleur ' + this.color);

  }


}
