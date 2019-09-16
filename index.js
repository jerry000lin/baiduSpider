const cheerio = require('cheerio')
const iconv = require('iconv-lite');
const request = require('request');
const fs = require('fs');

const dataList = []
const start = 20020
const DATA_LENGTH = 5000;
const wucha = 0
let flag = 0
for (let p = start / 20; p <= (start + DATA_LENGTH) / 20; p++) {
    request({
        url: `http://tieba.baidu.com/f/like/furank?kw=%E5%B0%B1%E4%B8%9A&ie=utf-8&pn=${p}`,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            "Upgrade-Insecure-Requests": 1
        },
        encoding: null
    }, (error, response, body) => {
        flag = flag + 20
        if (!error && response.statusCode == 200) {
            const decodeBody = iconv.decode(body, "GBK");
            const $ = cheerio.load(decodeBody)
            const trList = $(".drl_list_item")
            trList.each(function (i, elem) {
                const tdList = trList.eq(i).children("td")
                const aData = {
                    name: tdList.eq(1).text(),
                    link: "http://tieba.baidu.com/home/main/" + tdList.eq(1).find("a").attr("href"),
                    level: tdList.eq(2).find("div").attr("class").split("_")[1],
                }
                dataList.push(aData)
            })
            console.log(flag, " ", dataList.length)
            if (flag == DATA_LENGTH) {

                dataList.sort((a, b) => {
                    return b.level.slice(2) * 1 - a.level.slice(2) * 1
                })
                const myList = dataList.map(item => item.name)
                doWirteFile(myList.join("\n"))
                // let control_flag = 0
                // for (let itemIndex = 0; itemIndex < dataList.length; itemIndex++) {
                //     request({
                //         url: dataList[itemIndex].link,
                //         headers: {
                //             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                //             'Accept-Language': 'zh-CN,zh;q=0.8',
                //             'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
                //             'Cache-Control': 'max-age=0',
                //             'Connection': 'keep-alive',
                //             "Upgrade-Insecure-Requests": 1,
                //             "timeout": 10000
                //         },
                //         encoding: null
                //     }, (error, response, body) => {
                //         control_flag++
                //         console.log(control_flag)
                //         if (!error && response.statusCode == 200) {
                //             const no_content_picBody = iconv.decode(body, "GBK");
                //             const $ = cheerio.load(no_content_picBody)
                //             const no_content_pic = $(".no_content_pic")
                //             if (no_content_pic.length == 1) {
                //                 dataList[itemIndex].isExist = false
                //             } else {
                //                 dataList[itemIndex].isExist = true
                //             }
                //         } else {
                //             dataList[itemIndex].isExist = false
                //         }
                //         if (control_flag == dataList.length - wucha) {
                //             console.log("sortsortsortsortsortsortsortsortsortsortsortsort")
                //             dataList.sort((a, b) => {
                //                 return b.level.slice(2) * 1 - a.level.slice(2) * 1
                //             })
                //             const myNameList = dataList.reduce((array, item) => {
                //                 if (item.isExist !== undefined) {
                //                     if (!item.isExist) {
                //                         return array
                //                     }
                //                 }
                //                 array.push(item.name)
                //                 return array
                //             }, [])
                //             doWirteFile(myNameList.join("\n"))
                //         }
                //     })
                // }
            }
        }
    });
}

function doWirteFile(dataList) {
    fs.exists("./" + "test.txt", function (exits) {
        if (exits) {
            fs.appendFile("./" + "test.txt", dataList, 'utf-8', function (err) {
                if (err) {
                    console.error("文件生成时发生错误.");
                    throw err;
                }
            });
        } else {
            console.info('文件不存在，将生成新文件.');
            // 对于写入的内容JSON.stringify(dataList),，最好可以用JSON.stringify转化一下。
            //如果把数组直接写入文件的话，很可能会得到 [Object] 这样的形式
            fs.writeFile("./" + "test.txt", dataList, 'utf-8', function (err) {
                if (err) {
                    console.error("文件生成时发生错误.");
                    throw err;
                }
                console.info('文件已经成功生成.');
            });
        }
    });

}