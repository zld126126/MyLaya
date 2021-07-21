/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.d3.js")
loadLib("libs/laya.physics3D.js")
//-----libs-end-------
// loadLib("js/bundle.js");

// 先做首屏渲染
var MainRender = function () {
    var GameConfig = {};
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";

    Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    Laya["Physics"] && Laya["Physics"].enable();
    Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    Laya.stage.scaleMode = GameConfig.scaleMode;
    Laya.stage.screenMode = GameConfig.screenMode;
    Laya.stage.alignV = GameConfig.alignV;
    Laya.stage.alignH = GameConfig.alignH;

    var tTestText = new Laya.Text();
    tTestText.autoSize = true;
    tTestText.text = "正在努力加载中 ...";
    tTestText.fontSize = 20;
    tTestText.color = "#FFFFFF";
    tTestText.x = 300;
    tTestText.y = 300;
    Laya.stage.addChild(tTestText);

    Laya.timer.once(1500, this, function () {
        console.log("加载完成");
        Laya.stage.removeChild(tTestText);
        loadLib("js/bundle.js");;
    });
};

MainRender();