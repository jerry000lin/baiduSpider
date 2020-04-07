const async = require('async');
const cheerio = require('cheerio')
const iconv = require('iconv-lite');
const request = require('request');
const fs = require('fs');

transferMyData("自驾游name")

function transferMyData(name) {

    // 同步读取
    var data = fs.readFileSync(name + '.txt');
    const itemList = data.toString().split("\r\n").map(item => {
        // console.log(item.slice(3))
        return {
            name: item.slice(3)
        }
    })

    let forwardElement = itemList[0]
    forwardElement.isDeadPeople = false
    let regex = getRegex(forwardElement.name)
    for (let index = 1; index < itemList.length; index++) {
        const element = itemList[index];
        if (regex.test(element.name)) {
            forwardElement.isDeadPeople = true
            element.isDeadPeople = true
            continue
        } else {
            element.isDeadPeople = false
        }
        regex = getRegex(element.name)

        forwardElement = element
    }
    let filterItemLish = itemList.filter(item => !item.isDeadPeople)
    let nameList = filterItemLish.map(item => `${item.name}`)
    doWirteFile(nameList.map(item => `@${item}`).join("\r\n"), 1 + name + "name" + "rd")
}


function getRegex(name) {
    let regexString = ""
    for (let nameStringIndex = 0; nameStringIndex < name.length; nameStringIndex++) {
        const charElement = name[nameStringIndex];
        if (charElement >= '\u4e00' && charElement <= '\u9fa5') {
            regexString += `[\\u4E00-\\u9FFF]`
        } else if ((charElement >= 'A' && charElement <= 'Z') || (charElement >= 'a' && charElement <= 'z')) {
            regexString += `[a-zA-Z]`
        } else if (!isNaN(charElement)) {
            regexString += `[0-9]`
        } else if (charElement == "_") {
            regexString += `_`
        }
    }
    return eval(`/^${regexString}$/`)
}


function doWirteFile(nameList, fileName) {
    fs.writeFile("./" + fileName + ".txt", nameList, 'utf-8', function (err) {
        if (err) {
            console.error("./" + fileName + ".txt" + "文件生成时发生错误.");
            throw err;
        }
        console.info("./" + fileName + ".txt" + '文件已经成功生成.');
    })
}