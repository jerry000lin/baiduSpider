const async = require('async');
const cheerio = require('cheerio')
const iconv = require('iconv-lite');
const request = require('request');
const fs = require('fs');


function createUrlLists(base, size) {
    const list = []
    for (let i = 1; i <= size; i++) {
        list.push(base + i)
    }
    return list
}
async.series([
    // getData("http://tieba.baidu.com/f/like/furank?kw=%D1%DB%BE%A6&pn=", 50, "悉尼大学"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%B0%AE%B9%B7&pn=", 1200, "眼睛"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%CF%F7%B9%C7&pn=", 500, "合肥整形"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%C1%F4%D1%A7%D6%D0%BD%E9&pn=", 1500, "网络推广"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%BC%F5%B7%CA%B4%EF%C8%CB&pn=", 4000, "完美世界"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%B4%F3%BB%B0%CE%F7%D3%CE%B9%AB%D2%E6%B7%FE&pn=", 150, "大话西游公益服"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%CE%DA%BF%CB%C0%BC%C1%F4%D1%A7&pn=", 200, "乌克兰留学"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%C5%B2%CD%FE&pn=", 400, "挪威"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%CA%D6%D5%CA%BD%BB%D2%D7&pn=", 1500, "手帐交易"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%B2%BB%D4%D0%B2%BB%D3%FD&pn=", 1650, "不孕不育"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%BD%AD%CE%F7%BD%CC%CA%A6&pn=", 1650, "江西教师"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%D7%A2%BB%E1&pn=", 10000, "注会"),
    getData("http://tieba.baidu.com/f/like/furank?kw=%BB%F9%BD%F0&pn=", 1000, "自驾游"),

], function (err, result) {
    console.log(result)
})



// 创建一个url的请求列表，用于map函数中的 coll 
function getData(baseurl, page, fileName) {
    return (cb) => {
        const dataList = []
        let urlLists = createUrlLists(baseurl, page);
        async.mapLimit(urlLists, 20, function (url, callback) {
            console.log(url)
            // 这里的参数url便是urllists中的每一项
            var option = {
                url: url,
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
                        const isVip = tdList.eq(1).find(".drl_item_vip").text()
                        if (isVip) {
                            const aData = {
                                name: tdList.eq(1).text(),
                                link: "http://tieba.baidu.com" + tdList.eq(1).find("a").attr("href"),
                                level: tdList.eq(3).text() * 1,
                                pn: option.url.split("&pn=")[1] * 1,
                                index: option.url.split("&pn=")[1] * 1 * i
                            }
                            dataList.push(aData)
                        }
                    })
                    // 这里的callback是对函数自身的循环
                    callback(null, url, option);
                }
            });

        }, (err, result) => {
            // 这里是要在前面的函数全部完成之后再调用
            // 因此shopLists在这个时候已经是了全部url数据的状态了
            // 这里的result其实就是我们传入的urlLists
            // 但是我们没有对urlLists进行操作，所以我们也可以使用each方法来实现同样的功能
            // dataList.sort((a, b) => b.level - a.level)
            console.log(dataList)
            async.mapLimit(dataList, 20, (dataItem, callback) => {
                const option = {
                    url: dataItem.link,
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                        'Accept-Language': 'zh-CN,zh;q=0.9',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
                        'Cache-Control': 'max-age=0',
                        'Connection': 'keep-alive',
                        "Upgrade-Insecure-Requests": 1
                    }
                }
                request(option, (error, response, body) => {
                    try {
                        if (!error && response.statusCode == 200) {
                            const $ = cheerio.load(body)
                            const vip = $(".vip_red").text()
                            const noContent = $(".info-content").text()
                            dataItem.text = noContent
                            dataItem.isVip = vip
                            console.log(dataItem)
                            callback(null, dataItem, option);
                        } else {
                            doWirteFile(dataItem.link)
                        }
                    } catch (err) {
                        console.log(err)
                    }
                });
            }, (err, result) => {
                console.log("fileName", fileName)
                dataList.sort((a, b) => b.index - a.index)
                cb(null, fileName)
                doWirteFile(JSON.stringify(dataList), fileName)
            })
        });
    }

}

function doWirteFile(dataList, fileName) {
    console.log("正在写文件")
    fs.exists("./" + fileName + ".txt", (exits) => {

        // 对于写入的内容JSON.stringify(dataList),，最好可以用JSON.stringify转化一下。
        //如果把数组直接写入文件的话，很可能会得到 [Object] 这样的形式
        fs.writeFile("./" + fileName + "vipData" + ".txt", dataList, 'utf-8', (err) => {
            if (err) {
                console.error(fileName + "文件生成时发生错误.");
                throw err;
            }
            console.info('文件已经成功生成.');
        });

    });
}