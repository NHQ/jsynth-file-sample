var fs = require('fs')
var b2a = require('base64-arraybuffer')
var fileBuff = require('./')
var context = new AudioContext()

var file = fs.readFileSync('./loop.wav', 'base64');

var buff = b2a.decode(file);

fileBuff(context, buff, function(err, source){
  source.loop = true
  source.connect(context.destination)
  source.start(0)
});
