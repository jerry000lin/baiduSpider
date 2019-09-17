const express = require('express')
const app = express()
const cheerio = require('cheerio')
const iconv = require('iconv-lite');


var request = require('request');
app.get('/', (req, res) => {
  const dataList = []
  for(let i=1;i<=100;i++){

    request({
      url: `http://tieba.baidu.com/home/main/?un=ering310&fr=furank`,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        "Upgrade-Insecure-Requests": 1
      }
    }, function (error, response, body) {
      const $ = cheerio.load(body)
      console.log(response.statusCode)
      const noContent = $(".no_content_text").text()
      res.send(noContent)
    });
  }

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))