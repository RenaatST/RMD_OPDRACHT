'use strict';

module.exports = [

  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => reply.view('index', {
      name: 'Renaat Stuijk & Tom Heldenbergh',
      title: 'MATH.RANDOM'
    })
  }

];
