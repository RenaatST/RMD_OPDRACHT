'use strict';

import Speler from './Speler.js';
import {MathUtil} from '../util/';

import EventEmitter from 'eventemitter2';

export default class Mobile extends EventEmitter {

  constructor(socket, socketid){
    super();
    this.socket = socket;
    this.socketid = socketid;
    console.log('dit is mobile ' + socketid);

    let speler = new Speler(this.socketid, MathUtil.randomColor());

    console.log(speler);

    $('.button :submit').click(function(e) {
      e.preventDefault();
      socket.emit('startgame', speler);
      $('.start-mobile').hide();
    });
  }







}
