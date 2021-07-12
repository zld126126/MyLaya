import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Shader3D = Laya.Shader3D;
import Handler = Laya.Handler;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Node = Laya.Node;
import SpotLight = Laya.SpotLight;
import MeshSprite3D = Laya.MeshSprite3D;

export class SpotLightShadowMap extends SingletonScene {
    public camera: Camera;
    public demoScene: Scene3D;
    constructor() {
        super();
        // Laya3D.init(0,0);
        // Stat.show();
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        Shader3D.debugMode = true;

        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/testNewFunction/LayaScene_depthScene/Conventional/depthScene.ls", Handler.create(this, function (scene: Scene3D): void {
            this.demoScene = scene;
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, this.demoScene);
            this.camera = (<Camera>scene.getChildByName("Camera"));
            this.camera.addComponent(CameraMoveScript);
            this.camera.active = true;
            this.receaveRealShadow(this.demoScene);
        }));
    }
    receaveRealShadow(scene3d: Scene3D): void {
        var childLength: number = scene3d.numChildren;
        for (var i: number = 0; i < childLength; i++) {
            var childSprite: Node = scene3d.getChildAt(i);
            if (childSprite instanceof MeshSprite3D) {
                childSprite.meshRenderer.receiveShadow = true;
                childSprite.meshRenderer.castShadow = true;
            }
            else if (childSprite instanceof SpotLight) {
                //childSprite.shadowMode = ShadowMode.Hard;
                // Set shadow max distance from camera.
                childSprite.shadowDistance = 3;
                // Set shadow resolution.
                childSprite.shadowResolution = 512;
                // set shadow Bias
                //childSprite.shadowDepthBias = 1.0;
            }
        }
        return;
    }

}