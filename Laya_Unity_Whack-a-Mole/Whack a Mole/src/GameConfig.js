/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameRoot from "./scripts/GameRoot"
import UICtrl from "./scripts/UICtrl"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("scripts/GameRoot.js",GameRoot);
		reg("scripts/UICtrl.js",UICtrl);
    }
}
GameConfig.width = 1920;
GameConfig.height = 1080;
GameConfig.scaleMode ="fixedauto";
GameConfig.screenMode = "horizontal";
GameConfig.alignV = "middle";
GameConfig.alignH = "center";
GameConfig.startScene = "GameRoot.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
