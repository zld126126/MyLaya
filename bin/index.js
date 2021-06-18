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
loadLib("libs/laya.physics.js")
loadLib("libs/laya.html.js")
// 增加 文件存储操作库
loadLib("libs/FileSaver.js")
// 增加js 自定义库
loadLib("libs/TsCallJs.js")
//-----libs-end-------
loadLib("libs/fairygui/rawinflate.min.js");
loadLib("libs/fairygui/fairygui.js");
loadLib("js/bundle.js");
