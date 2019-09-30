const cheerio = require('cheerio')
const iconv = require('iconv-lite');
var request = require('request');

const dataList = []
// request({
//     url: `http://tieba.baidu.com/home/main/?un=c907040b053b&fr=furank`,
//     headers: {
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
//         'Accept-Language': 'zh-CN,zh;q=0.9',
//         'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
//         'Cache-Control': 'max-age=0',
//         'Connection': 'keep-alive',
//         "Upgrade-Insecure-Requests": 1,
//         "Host": "tieba.baidu.com"
//     }
// }, function (error, response, body) {
//     const decodeBody = iconv.decode(body, "GBK");
//     const $ = cheerio.load(decodeBody)
//     const no_content_pic = $(".no_content_pic")
//     console.log(no_content_pic.length)

//     let flag;
//     if (!error && response.statusCode == 200) {
//         flag = true
//     } else {
//         flag = false
//     }
//     console.log(flag)
// });

