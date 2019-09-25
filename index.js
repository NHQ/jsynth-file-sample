// handles audio files and raw, mono, audio buffers

module.exports = function(context, buff, cb){
  
  var name = buff.constructor.name
  console.log(buff, name)
  if(name == 'ArrayBuffer'){
    context.decodeAudioData(buff).then(function(data){
      var source = context.createBufferSource()
      source.buffer = data
      var gain = context.createGain()
      gain.channelCount = 2
      gain.channelCountMode = 'explicit'
      gain.channelInterpretation = 'speakers'
      source.connect(gain)
      source._connect = source.connect
      source.connect = gain.connect
      cb(null, source) 
    }).catch(function(err){cb(err, null)})
	
  }else if(name == 'Float32Array'){
  
    var source = context.createBufferSource();
      
    var buffer = context.createBuffer(1, buff.length, context.sampleRate)

    try{ // new
      buffer.copyToChannel(buff, 0, 0)
    }catch(err){ // old
      buffer.getChannelData(0).set(buff)
    }
    
    source.buffer = buffer;
    
    var gain = context.createGain()
    gain.channelCount = 1
    gain.channelCountMode = 'explicit'
    gain.channelInterpretation = 'speakers'
    source.gain = gain
    source.connect(gain)
    source._connect = source.connect
    source.connect = gain.connect
    cb(null, source)
  }
}
