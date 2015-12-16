'use strict';

class Client{

  constructor(socketidMobile, socketidDesktop, color){
    this.socketidMobile = socketidMobile;
    this.socketidDesktop = socketidDesktop;
    this.color = color;
  }
}

module.exports = Client;
