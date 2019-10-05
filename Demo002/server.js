let Koa     = require('koa');
let Router  = require('koa-router');
let Receiver= require('koa-body');
let Sender  = require('koa-send');
let moment  = require('moment');
let _       = require('lodash');
let path    = require('path');
let fs      = require('fs');
let qs      = require('query-string');

let router  = Router();

router.get('/upload', async(ctx, next) => {
    ctx.body =
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="file" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>';
    ctx.statusCode = 200;

    await next;
});

function saveFile(sourceFile, targetFile) {
    return new Promise((resolve, reject) => {
        let reader  = fs.createReadStream(sourceFile);
        let writer  = fs.createWriteStream(targetFile);

        reader.pipe(writer);

        writer.on('finish', () => resolve(path));
        writer.on('error', (err) => reject(err));
    });
}

router.post('/upload', async(ctx, next) => {
    // 获取客户端上传的文件
    let file = ctx.request.files.file;

    if (!file && !file.Path) {
        ctx.body = '参数错误，file不能为空';
        ctx.statusCode  = 403;
        return;
    }

    // 文件服务器中创建相关目录
    let targetDir = path.join(__dirname, 'upload');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, {recursive: true});
    }

    // 保存上传的文件数据到服务器文件内
    let fileName = moment().format('YYYYMMDDHHmmss') + _.random(1000, 9999);
    let extName  = path.extname(file.name);
    let targetPath  = path.format({dir: targetDir, name: fileName, ext: extName});
    await saveFile(file.path, targetPath)
        .then((result) => ctx.body = {res: `文件上传成功`, path: targetPath})
        .catch((error) => ctx.body = {res: `上传失败`, path: targetPath});

    await next;
});

router.get('/download', async(ctx, next) => {
    let {fileName} = ctx.query;

    if (_.isEmpty(fileName)) {
        ctx.status  = 402;
        ctx.body    = '参数错误，fileName 不能为空';
        return;
    }

    let sourcePath = path.join(__dirname, 'upload', fileName);
    if (!fs.existsSync(sourcePath)) {
        ctx.status  = 403;
        ctx.body    = '文件不存在';
        return;
    }

    let stats = fs.lstatSync(sourcePath);
    let reader = fs.createReadStream(sourcePath);
    ctx.res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment;filename=` + encodeURIComponent(fileName),
        'Content-Length': stats.size});
    ctx.body = reader;

    await next;
});

router.get('/file', async(ctx, next) => {
    let {fileName} = ctx.query;

    let sourcePath = path.join(__dirname, 'upload', fileName);
    if (fs.existsSync(sourcePath)) {
        let stats = fs.statSync(sourcePath);
        ctx.res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=' + encodeURIComponent(fileName),
            'Content-Length': stats.size});
        await Sender(ctx, fileName,{root: path.resolve(__dirname, './upload')});
    }

    await next;
});

let app = new Koa();
require('koa-qs')(app);
app.use(Receiver({
    formLimit: '1mb',
    multipart: true,
    formidable: {
        maxFieldsSize: 10 * 1024 * 1024,
        keepExtensions: true
    }
}));
app.use(router.routes());
app.listen(3000, () => {
    console.log('hello server');
});
