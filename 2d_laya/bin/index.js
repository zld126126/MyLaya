/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "portrait";

//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.ani.js")
loadLib("libs/laya.html.js")
loadLib("libs/laya.particle.js")
loadLib("libs/laya.tiledmap.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.device.js")
loadLib("libs/laya.physics.js")
loadLib("libs/bmap_helper.js");
loadLib("libs/protobuf-library.min.js")
loadLib("libs/protobuf-bundles.min.js")
//-----libs-end-------
loadLib("js/bundle.js");
