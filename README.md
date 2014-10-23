# jsynth-file-sample

This module will turn your audio file / clip into a Web Audio source node. Use it to create samples.

Use with [browserify](http://github.com/substack/browserify)v.2 and [brfs](http://github.com/substack/brfs)

```
npm install jsynth-file-sample
```

## usage

see example.js - uses fs.readFileSync as supported by **brfs**. Use base64 encoding.

```
npm install -g browserify -opa
git clone https://github.com/NHQ/jsynth-file-sample
cd jsynth-file-sample
npm install
opa -e example.js -o public/bundle.js -t brfs
```

