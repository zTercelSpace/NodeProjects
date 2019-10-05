let qrImage = require('qr-image');
let moment  = require('moment');
let path    = require('path');
let fs      = require('fs');
let _       = require('lodash');

function generateCode(text, type = 'png') {
    return new Promise( (resolve, reject) => {
        let image = qrImage.image(text, {type: type});
        return image ? resolve(image) : reject('error');
    });
};

generateCode('http://www.baidu.com', 'png')
    .then((image) => {
        let qrPath  = __dirname + moment().format('YYMMDDHHmmss') + _.random(100, 999) + '.png';
        image.pipe(fs.createWriteStream(qrPath));
        console.log('二维码生成成功')
    })
    .catch((error) => {
        console.log('二维码生成失败');
    });

