var fs = require("fs");

const name = "卖东西"
// 同步读取
var data = fs.readFileSync(name + '.txt');
const itemList = JSON.parse(data)
itemList.sort((a, b) => b.level - a.level)
const nameList = itemList.filter(item => {
    if (item.text == "此用户被屏蔽") {
        return false
    } else if (item.name.indexOf("com") != -1) {
        return false
    } else if (item.name.indexOf("Q") != -1) {
        return false
    } else if (item.name.indexOf("微") != -1) {
        return false
    }
    return true
}).map(item => `回复 ${item.name} ：`).join("\r\n")


console.log("准备写入文件");


fs.writeFile("./" + name + "name.txt", nameList, 'utf-8', function (err) {
    if (err) {
        console.error("文件生成时发生错误.");
        throw err;
    }
    console.info('文件已经成功生成.');
});
}