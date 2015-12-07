'use strict';

class Client{

  constructor(id, socketid){
    this.id = id;
    this.socketid = socketid;
    this.nickname = `user ${this.id}`;
  }
}
module.exports = Client;
