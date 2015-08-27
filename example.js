var fs = require('fs')
var b2a = require('base64-arraybuffer')
var jdelay = require('jdelay')
var jsynth = require('jsynth')
var amod = require('amod')
var ready = require('domready')

var fileBuff = require('./')
var context = new AudioContext()
var file = fs.readFileSync('./loop_ratatat.wav', 'base64');

ready(function(){


  var buff = b2a.decode(file);

  fileBuff(context, buff, function(e, source){
    //source.connect(context.destination)
    //source.start(0)
    gotSource(e,source)
  })


  function gotSource (err, source){
    var sr = context.sampleRate
    var bpm = 115
    var scb = 60 / bpm
    var spb = Math.floor(sr * scb)
    var l = source.buffer.getChannelData(0).length
    var f = .67
    var m = .07
    var dist = 16 
    var odist = 32
    var d = jdelay(spb * 4, f, m)
    var od = jdelay(spb * 4, f, m)
    var mod = 0
    var a = 1
    var warble = jdelay(spb * 1/3, 1, 1)
    var synth = jsynth(context, function(t, s, i){
      if(s > l * 2 && s % l > l / 2) a = amod(3/4, 3/8, t, 1 / scb / amod(9, 6, t, 1 / scb / 24)) 

      else a = 1
      if(s < l * 1.5){
        //(d(i, s % l < scb * 12 * sr ? Math.floor(spb * 1/3 - mod): spb * dist, 1 - f, 1 - m))  
        f += .0000000005
        m += .00000000005
        d(i* a, Math.floor(spb * Math.floor(dist)), 1 -f, 1-m)
        return  i*a//warble(i, spb * 1 / 3, f, m)
      }
      else{
        if(s % l  === 0){ 
          //dist+=2
          od = d
          odist = 32 
          dist = 16 
          f = .37
          m = .07
          mod = 0
          d = jdelay(spb * dist, f, m)
        }
        else if(s % l ===  Math.floor(l / 2)){
          od = d
          f = 0.37
          m = 0.07
          odist = 32//dist 
          dist = 32
          mod = scb * sr * 1/2
          d = jdelay(spb * dist, f, m)
        }
        f += .0000000005
        m += .00000000005
        
        d(i* a, Math.floor(spb * Math.floor(dist)), 1 -f, 1-m)
        return a*((i/2) + od(i, s % l < scb * 12 * sr ? Math.floor(spb * 1/3): Math.floor(spb * odist), 1 - f, 1 - m))  
      }
    })
    window.woohooGlobal = synth
    source.loop = true
    //source.playbackRate.value = 5/9;
    synth.connect(context.destination)
    source.connect(synth)
    source.start(context.currentTime)
  };

  function trash(_track, div, ac, offset){
    var track = new Float32Array(Math.floor(_track.length / div))
    for(var x = 0; x < track.length; x++){
      var y = 0
      for(var z = 0; z < div; z++){
        y += _track[x * z]
      }
      track[x] = y / div
    }
    if(ac){
      var tt = new Float32Array(Math.floor(_track.length / ac))
      offset = tt.length * offset 
      tt.set(track, offset || 0)
      return tt
    }else return track 
  }

  function mergeTracks(tracks, a){
    a = a || 1
    var track = new Float32Array(tracks[0].length)
    for(var x = 0; x < track.length; x++){
      var y = 0
        for(var z = 0; z < tracks.length; z++){
          y += tracks[z][x] 
        }
      track[x] = y / tracks.length * a
    }
    return track
  }

})
