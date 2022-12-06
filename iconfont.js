// iconfont 转 fluter icon 脚本
const http = require('http');
const fs = require('fs');
const path = require('path');
// iconfont 项目id
const key = 'font_3806246_qxxsrk97ttk'
//at.alicdn.com/t/c/font_3806246_qxxsrk97ttk.js
const url = 'http://at.alicdn.com/t/c/' + key;

const outPathCSS = './miniprogram/style/iconfont.less';

http.get(url + '.css', function (res) {
    let url = path.resolve(__dirname, outPathCSS)
    let stream = fs.createWriteStream(url);
    res.pipe(stream).on('close', function () {
        let str = `[class*="icon-"] {
    font-family: "iconfont" !important;
    font-size  : inherit;
    font-style : normal;
}`

        fs.readFile(url, 'utf-8', (err, data) => {
            if (!err) {
                data = data.replace(/\.iconfont \{(.)+?\}/gms, () => str)
                fs.writeFileSync(url, data, 'utf-8')
                console.log('css文件下载完成')
            }
        })
    })
})
