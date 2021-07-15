import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import ReflectionProbe = Laya.ReflectionProbe;
import PixelLineSprite3D = Laya.PixelLineSprite3D;
import Handler = Laya.Handler;
import Utils3D = Laya.Utils3D;
import Color = Laya.Color;

export class ReflectionProbeDemo extends SingletonScene {
    constructor() {
        //初始化引擎
        // Laya3D.init(0, 0);
        // Stat.show();
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        super();

        //加载场景
        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/ReflectionProbeDemo/Conventional/outpost with snow.ls", Handler.create(this, function (scene: Scene3D): void {
            this.AutoSetScene3d(scene);

            //获取场景中的相机
            var camera: Camera = (<Camera>scene.getChildByName("Camera"));
            camera.addComponent(CameraMoveScript);

            var reflectionProb: ReflectionProbe = scene.getChildByName("ReflectionProb") as ReflectionProbe;
            var lineSprite3D: PixelLineSprite3D = new PixelLineSprite3D(50, null);
            scene.addChild(lineSprite3D);
            //@ts-ignore  画出反射探针的volume包围盒
            Utils3D._drawBound(lineSprite3D, reflectionProb.bounds._boundBox, Color.RED);
        }));
    }
}