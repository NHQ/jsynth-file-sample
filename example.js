var fs = require('fs')
var b2a = require('base64-arraybuffer')
var fileBuff = require('./')
var context = new AudioContext()
//
var file = fs.readFileSync('./loop.wav', 'base64');

var buff = b2a.decode(file);

fileBuff(context, buff, function(e, source){
  gotSource(e,source)
  var tracks = []
  for(var x = 0; x < source.buffer.numberOfChannels; x++){
    tracks.push(source.buffer.getChannelData(x))
  }
  
    fileBuff(context, trash(mergeTracks(tracks, 1.3),1/2), gotSource)
  //fileBuff(context, trash(mergeTracks(tracks, 1.3),1/2, 1), gotSource)
  setTimeout(function(){
    fileBuff(context, trash(mergeTracks(tracks, .67),Math.PI * 4, Math.PI / 4, 1/2), gotSource)
    fileBuff(context, trash(mergeTracks(tracks),8, 1/4, 7/8), gotSource)
    fileBuff(context, trash(mergeTracks(tracks),4, 1/2, 2/4), gotSource)
    fileBuff(context, trash(mergeTracks(tracks),2, 1, 1/20), gotSource)
  }, 4.05 * 2000)
})

function gotSource (err, source){
  
  source.loop = true
  source.playbackRate.value = 5/9;
  source.connect(context.destination)
  source.start(0)
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
