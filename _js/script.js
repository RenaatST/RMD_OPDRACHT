'use strict';

const init = () => {

  let canvas = document.getElementById("test");
  let ctx = canvas.getContext("2d");
  var count = 0;
  var start_x = 0;
  var start_y = 100;
  var end_x = 10000;
  var end_y = 100;

  var counter = setInterval(countNumbers, 100);

  ctx.beginPath();
  ctx.moveTo(start_x, start_y);
  console.log("Start");
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

  function countNumbers(){
    count += 1;
    ctx.lineTo((start_x + count), start_y);

    ctx.stroke();
    console.log(count);
    if(start_x === end_x){
      clearInterval(counter);
      console.log("End");
    }
  }

};

init();
