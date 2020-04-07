var fs = require("fs");

[
    "自驾游",
    // "云阳",
    // "基金300000",
    // "恶霸犬",
    // "iphone11"
    // "立刷"
    // "大话西游公益服",
    // "不孕不育",
    // "江西教师",
    // "挽回爱",
    // "手帐交易",
    // "不孕不育"
].forEach(item => {
    transferMyData(item)
})
function transferMyData(name) {

    // 同步读取
    var data = fs.readFileSync(name + '.txt');
    const itemList = JSON.parse(data)
    itemList.sort((a, b) => a.index - b.index)
    itemList.sort((a, b) => a.level - b.level)
    itemList.sort((a, b) => a.pn - b.pn)
    let forwardElement = itemList[0]
    forwardElement.isDeadPeople = false
    let regex = getRegex(forwardElement.name)

    for (let index = 1; index < itemList.length; index++) {
        const element = itemList[index];
        element.len = element.name.length
        // if (element.name.length <= 4 && element.name.length != 2) {
        //     element.isDeadPeople = false
        //     continue
        // }
        if (regex.test(element.name)) {
            forwardElement.isDeadPeople = true
            element.isDeadPeople = true
            continue
        } else {
            element.isDeadPeople = false
        }
        let regexString = ""
        for (let nameStringIndex = 0; nameStringIndex < element.name.length; nameStringIndex++) {
            const charElement = element.name[nameStringIndex];
            if (charElement >= '\u4e00' && charElement <= '\u9fa5') {
                regexString += `[\\u4E00-\\u9FFF]`
            } else if ((charElement >= 'A' && charElement <= 'Z') || (charElement >= 'a' && charElement <= 'z')) {
                regexString += `[a-zA-Z]`
            } else if (!isNaN(charElement)) {
                regexString += `[0-9]`
            }
        }
        regex = eval(`/^${regexString}$/`)

        forwardElement = element
    }

    doWirteFile(itemList.filter(item => item.isDeadPeople).map(item => item.name).join("\r\n"), name + "deadPeople")



    // let filterItemLish = itemList
    let filterItemLish = itemList.filter(item => !item.isDeadPeople)

    nameList = filterItemLish.filter(item => {
        if (item.text == "此用户被屏蔽") {
            return false
        } else if (item.name == "") {
            return false
        } else if (item.name.indexOf("com") != -1) {
            return false
        } else if (item.name.indexOf("啭") != -1) {
            return false
        } else if (item.name.indexOf("Q") != -1) {
            return false
        } else if (item.name.indexOf("微") != -1) {
            return false
        } else if (item.name.indexOf("絵") != -1) {
            return false
        } else if (item.name.indexOf("亜") != -1) {
            return false
        } else if (item.name.indexOf("香") != -1) {
            return false
        } else if (item.name.indexOf("恵") != -1) {
            return false
        } else if (item.name.indexOf("奈") != -1) {
            return false
        } else if (item.name.indexOf("佐") != -1) {
            return false
        } else if (item.name.indexOf("阪") != -1) {
            return false
        } else if (item.name.indexOf("藤") != -1) {
            return false
        } else if (item.name.indexOf("崎") != -1) {
            return false
        } else if (item.name.indexOf("纪") != -1) {
            return false
        } else if (item.name.indexOf("瀬") != -1) {
            return false
        }
        return true
    }).map(item => `回复 ${item.name}`).join("\r\n")

    doWirteFile(nameList, name + "name")
}


function doWirteFile(nameList, fileName) {
    fs.writeFile("./" + fileName + ".txt", nameList, 'utf-8', function (err) {
        if (err) {
            console.error("文件生成时发生错误.");
            throw err;
        }
        console.info('文件已经成功生成.');
    })
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
        }
    }
    return eval(`/^${regexString}$/`)
}