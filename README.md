# jsynth-file-sample

This module will turn your audio file / clip into a Web Audio source node. Use it to create samples.

Use with [browserify](http://github.com/substack/browserify)v.2 and [brfs](http://github.com/substack/brfs)

```
npm install jsynth-file-sample
```

## usage

example.js - use fs.readFileSync as supported by **brfs**. Use base64 encoding.

```js
var fs = require('fs')
,   fileBuff = require('./')
,   context = new webkitAudioContext()
;

var file = fs.readFileSync('./loop.wav', 'base64'); // <----  

var sample = fileBuff(context, file);

sample.loop = true;

sample.connect(context.destination)

sample.start(0)
```

To run example.js
```js
npm install -g browserify -opa
git clone https://github.com/NHQ/jsynth-file-sample
cd jsynth-file-sample
opa -n -e example.js
```

