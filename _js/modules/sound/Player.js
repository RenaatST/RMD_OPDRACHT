'use strict';

import Effects from '../../data/Effects';
import MathUtil from '../util/MathUtil';

export default class Player {

  constructor(ctx){
    this.ctx = ctx;
  }

  play(moving, fixed){

    let source;

    if(fixed.type === 'samples'){
      source = this.ctx.createBufferSource();
      source.buffer = fixed.sample;
    }else{
      source = this.ctx.createOscillator();
      source.frequency.value = fixed.frequency;
    }

    let panner = this.ctx.createPanner();
    panner.panningModel = 'equalpower';
    panner.setPosition(
      fixed.panning,
      0,
      1 - Math.abs(fixed.panning)
    );

    let gain = this.ctx.createGain();
    gain.gain.value = fixed.volume;

    source.connect(panner);
    panner.connect(gain);

    let effect = moving.effect.type;

    if(effect === Effects.FILTER.type){

      let filter = this.ctx.createBiquadFilter();

      filter.type = Math.round(Math.random()) ? 'highpass': 'lowpass';
      filter.frequency.value = MathUtil.randomBetween(1000, 9000);

      filter.gain.value = 60;
      gain.connect(filter);

      filter.connect(this.ctx.destination);

    }else if(effect === Effects.DELAY.type){

      let delay = this.ctx.createDelay(0.6 + (Math.random()*2));

      gain.connect(delay);

      gain.connect(this.ctx.destination);
      delay.connect(this.ctx.destination);

    }else{

      gain.connect(this.ctx.destination);

    }

    source.start();

    if(fixed.type === 'osc'){
      source.stop(this.ctx.currentTime + 0.2);
    }

  }

}
