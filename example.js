var fs = require('fs')
var b2a = require('base64-arraybuffer')
var jdelay = require('jdelay')
var jsynth = require('jsynth')
var amod = require('amod')
var ready = require('domready')
var touchdown = require('../touchdown')

var fileBuff = require('./')
var context = new AudioContext()
var file = fs.readFileSync('../../Downloads/yah.mp3', 'base64');

touchdown.start(document.body)
var x = 0, y =0
var w = window.innerWidth
var h = window.innerHeight
document.body.addEventListener('mousemove', function(e){
  x = e.pageX / w
  y = e.pageY / h
})

document.body.addEventListener('touchdown', dv)
document.body.addEventListener('deltavector', dv)
document.body.addEventListener('liftoff', dv)



function dv(ev){
  x = ev.detail.x / w
  y = ev.detail.y / h
}


ready(function(){


  var buff = b2a.decode(file);
  fileBuff(context, buff, function(e, source){
    //source.connect(context.destination)
    //source.start(0)
    gotSource(e,source)
  })


  function gotSource (err, source){
    var sr = context.sampleRate
    var bpm = 92
    var scb = 60 / bpm
    var spb = Math.floor(sr * scb)
    var l = source.buffer.getChannelData(0).length
    var f = .67
    var m = .07
    var dist = 1/4
    var odist = 32
    var d = jdelay(spb * 4, f, m)
    var od = jdelay(spb * 4, f, m)
    var mod = 0
    var a = 1
    var warble = jdelay(spb , 1, 1)
    var synth = jsynth(context, function(t, s, i){
      a = amod(3/4, 1/8 * ((x) + (y)), t, (2 * bpm / 60)) 

        f += .0000000005
        m += .00000000005
        
        //return d(i* a, Math.floor(spb * Math.floor(dist * (x * y))), 1 -x, 1-y)
        return a*((i) + od(i, Math.floor(spb * dist * (y)),   x, 1))  
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
