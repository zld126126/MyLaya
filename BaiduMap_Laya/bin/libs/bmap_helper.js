/**
 * 加载百度地图
 * By dongtech 20210708
 */
function LoadBaiduMapScript() {
    console.log("加载百度地图...");
    // 换成自己的AK就行
    const AK = "LLFeOkE5pI2u69TYXNMtFxu9E4hyNgif";
    const BMap_URL = "https://api.map.baidu.com/api?v=2.0&ak=" + AK + "&s=1&callback=onBMapCallback";
    return new Promise((resolve, reject) => {
        // 如果已加载直接返回
        if (typeof BMap !== "undefined") {
            resolve(BMap);
            window.baiduMap.init();
            return true;
        }
        // 百度地图异步加载回调处理
        window.onBMapCallback = function () {
            console.log("百度地图脚本初始化成功...");
            resolve(BMap);
            window.baiduMap.init();
        };
        // 插入script脚本
        let scriptNode = document.createElement("script");
        scriptNode.setAttribute("type", "text/javascript");
        scriptNode.setAttribute("src", BMap_URL);
        document.body.appendChild(scriptNode);
    });
}