const request = require('request');
const fs = require('fs');

(function(){
  request.get('https://cdn.pixabay.com/photo/2019/12/14/22/59/christmas-4695973__340.jpg')
    .on('response', res=>{console.log('res: ', res)})
    // .pipe(fs.createWriteStream('abc.jpg'))
})()

// (function(){
//   request.get('https://img.ssyer.com/video/1527559999889.mp4')
//     .on('response', res=>{console.log('res: ', res)})
//     .pipe(fs.createWriteStream('abc.mp4'))
// })()