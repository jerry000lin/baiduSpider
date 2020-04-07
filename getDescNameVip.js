var fs = require("fs");

[
    "自驾游"
    // "不孕不育",
    // "江西教师",
    // "挪威",
    // "大话西游公益服",
    // "乌克兰留学",
    // "手帐交易",
    // "不孕不育",
    // "悉尼大学",
    // "眼睛",
    // "合肥整形",
    // "网络推广",
    // "完美世界",
    // "眼睛",
    // "爱狗",
    // "削骨",
    // "留学中介",
    // "减肥达人",
].forEach(item => {
    transferMyData(item)
})

function transferMyData(name) {

    // 同步读取
    var data = fs.readFileSync(name + "vipData" + '.txt');
    const itemList = JSON.parse(data)
    console.log("源文件", itemList.length)
    itemList.sort((a, b) => b.level - a.level)
    let forwardElement = itemList[0]
    forwardElement.isDeadPeople = false
    let regex = getRegex(forwardElement.name)

    // for (let index = 1; index < itemList.length; index++) {
    //     const element = itemList[index];
    //     element.len = element.name.length
    //     if (element.name.length <= 4 && element.name.length != 2) {
    //         element.isDeadPeople = false
    //         continue
    //     }
    //     if (regex.test(element.name)) {
    //         forwardElement.isDeadPeople = true
    //         element.isDeadPeople = true
    //         continue
    //     } else {
    //         element.isDeadPeople = false
    //     }
    //     let regexString = ""
    //     for (let nameStringIndex = 0; nameStringIndex < element.name.length; nameStringIndex++) {
    //         const charElement = element.name[nameStringIndex];
    //         if (charElement >= '\u4e00' && charElement <= '\u9fa5') {
    //             regexString += `[\\u4E00-\\u9FFF]`
    //         } else if ((charElement >= 'A' && charElement <= 'Z') || (charElement >= 'a' && charElement <= 'z')) {
    //             regexString += `[a-zA-Z]`
    //         } else if (!isNaN(charElement)) {
    //             regexString += `[0-9]`
    //         }
    //     }
    //     regex = eval(`/^${regexString}$/`)

    //     forwardElement = element
    // }

    // doWirteFile(itemList.filter(item => item.isDeadPeople).map(item => item.name).join("\r\n"), name + "deadPeople")

    // doWirteFile(itemList.filter(item => !!item.isVip).map(item => item.name).join("\r\n"), name + "vip")


    let filterItemLish = itemList.filter(item => !item.isDeadPeople)

    const nameItemList = filterItemLish.filter(item => {
        if (item.text == "抱歉，您访问的用户已被屏蔽。") {
            return false
        } else if (item.name == "") {
            return false
        }
        //  else if (item.name.indexOf("com") != -1) {
        //     return false
        // }
        // else if (item.name.indexOf("Q") != -1) {
        //     return false
        // } else if (item.name.indexOf("微") != -1) {
        //     return false
        // }
        return true
    })

    console.log("name文件", nameItemList.length)
    const nameList = nameItemList.map(item => `回复 ${item.name}`).join("\r\n")


    doWirteFile(nameList, name + "vip" + "Name")
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