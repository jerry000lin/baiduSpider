const express = require('express')
const app = express()
const cheerio = require('cheerio')
const iconv = require('iconv-lite');


var request = require('request');
app.get('/', (req, res) => {
  const dataList = []

  // request({
  //   url: 'http://tieba.baidu.com/home/main/?un=%BF%D5%9Fo%D2%BB%C8%CBde%B3%C7%E6%82&fr=furank',
  //   headers: {
  //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  //     'Accept-Language': 'zh-CN,zh;q=0.9',
  //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
  //     'Cache-Control': 'max-age=0',
  //     'Connection': 'keep-alive',
  //     "Upgrade-Insecure-Requests": 1
  //   }
  // }, function (error, response, body) {


  //   const decodeBody = iconv.decode(body, "GBK");

  //   const $ = cheerio.load(body)
  //   const noContent = $(".info-content").text()
  //   const vip = $(".vip_red").text()
  //   console.log(response.statusCode)
  //   res.send(body)
  // });
  var option = {
    url: "http://tieba.baidu.com/f/like/furank?kw=%BC%F5%B7%CA%B4%EF%C8%CB&pn=1",
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      "Upgrade-Insecure-Requests": 1
    },
    encoding: null
  }

  // 请求用的函数与之前相同，其实写到外面会更好看
  request(option, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const decodeBody = iconv.decode(body, "GBK");
      var $ = cheerio.load(decodeBody, {
        ignoreWhitespace: true,
        xmlMode: true
      });
      const trList = $(".drl_list_item")
      trList.each(function (i, elem) {
        const tdList = trList.eq(i).children("td")
        const isVip = tdList.eq(1).find(".drl_item_vip")
        console.log("vip", !!isVip.text())
        const aData = {
          name: tdList.eq(1).text(),
          link: "http://tieba.baidu.com" + tdList.eq(1).find("a").attr("href"),
          level: tdList.eq(3).text() * 1,
          pn: option.url.split("&pn=")[1] * 1,
          index: option.url.split("&pn=")[1] * 1 * i
        }
        dataList.push(aData)
      })

    }
  });

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))