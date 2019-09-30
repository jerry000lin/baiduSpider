const async = require('async');
const cheerio = require('cheerio')
const iconv = require('iconv-lite');
const request = require('request');
const fs = require('fs');


function createUrlLists(base, size, startPage = 0) {
    const list = []
    for (let i = startPage; i <= size; i++) {
        list.push(base + i)
    }
    return list
}
async.series([
    getData("http://tieba.baidu.com/f/like/furank?kw=%D7%A2%BB%E1&pn=", 20000, "注会", 10000),
    // getData("http://tieba.baidu.com/f/like/furank?kw=iphone11&pn=", 275, "iphone11"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%B6%F1%B0%D4%C8%AE&pn=", 1500, "恶霸犬"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%C1%A2%CB%A2&pn=", 350, "立刷"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%C1%A2%CB%A2&pn=", 350, "立刷"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%CE%DA%BF%CB%C0%BC%C1%F4%D1%A7&pn=", 200, "乌克兰留学"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%C5%B2%CD%FE&pn=", 300, "挪威"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%CA%D6%D5%CA%BD%BB%D2%D7&pn=", 1500, "手帐交易"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%B2%BB%D4%D0%B2%BB%D3%FD&pn=", 1300, "不孕不育"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%CD%EC%BB%D8%B0%AE&pn=", 200, "挽回爱"),
    // getData("http://tieba.baidu.com/f/like/furank?kw=%BD%AD%CE%F7%BD%CC%CA%A6&pn=", 99, "江西教师"),
], function (err, result) {
    console.log(result)
})



// 创建一个url的请求列表，用于map函数中的 coll 
function getData(baseurl, page, fileName, startPage) {
    return (cb) => {
        const dataList = []
        let urlLists = createUrlLists(baseurl, page, startPage);
        async.mapLimit(urlLists, 20, function (url, callback) {
            // 这里的参数url便是urllists中的每一项
            var option = {
                url: url,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.8',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
                    'Cache-Control': 'max-age=0',
                    'Connection': 'keep-alive',
                    "Upgrade-Insecure-Requests": 1
                },
                timeout: 20000,
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
                        const aData = {
                            name: tdList.eq(1).text(),
                            link: "http://tieba.baidu.com" + tdList.eq(1).find("a").attr("href"),
                            level: tdList.eq(3).text() * 1,
                            pn: option.url.split("&pn=")[1] * 1,
                            index: option.url.split("&pn=")[1] * 1 * i
                        }
                        dataList.push(aData)
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
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
                        'Cache-Control': 'max-age=0',
                        'Connection': 'keep-alive',
                        "Upgrade-Insecure-Requests": 1
                    }
                }
                request(option, (error, response, body) => {
                    try {
                        if (!error && response.statusCode == 200) {
                            const $ = cheerio.load(body)
                            const noContent = $(".no_content_text").text()
                            // const noContent = $(".info-content").text()
                            dataItem.text = noContent
                            console.log(dataItem)
                            callback(null, dataItem, option);
                        } else {
                            console.log(err)
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
        if (exits) {
            fs.appendFile("./" + "test.txt", dataList, 'utf-8', (err) => {
                if (err) {
                    console.error("文件生成时发生错误.");
                    throw err;
                }
            });
        } else {
            console.info('文件不存在，将生成新文件.');
            // 对于写入的内容JSON.stringify(dataList),，最好可以用JSON.stringify转化一下。
            //如果把数组直接写入文件的话，很可能会得到 [Object] 这样的形式
            fs.writeFile("./" + fileName + ".txt", dataList, 'utf-8', (err) => {
                if (err) {
                    console.error(fileName + "文件生成时发生错误.");
                    throw err;
                }
                console.info('文件已经成功生成.');
            });
        }
    });
}