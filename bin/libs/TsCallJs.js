function TsCallJs(res) {
    console.log(res);
    // js调用ts
    window.Database.JsCallTs("JsCallTs");
}

// todo 临时处理保存文件
function SaveJson(text, fileName) {
    console.log(text, fileName);
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName);
}