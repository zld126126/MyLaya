import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Handler = Laya.Handler;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import PointLight = Laya.PointLight;
import LightSprite = Laya.LightSprite;
import SpotLight = Laya.SpotLight;
import Script3D = Laya.Script3D;
import Transform3D = Laya.Transform3D;

//自定义一个灯光位置自动变换的脚本
class LightMoveScript extends Script3D {
    forward: Vector3 = new Vector3();
    lights: LightSprite[] = [];
    offsets: Vector3[] = [];
    moveRanges: Vector3[] = [];

    onUpdate(): void {
        var seed: number = Laya.timer.currTimer * 0.002;
        for (var i: number = 0, n: number = this.lights.length; i < n; i++) {
            var transform: Transform3D = this.lights[i].transform;
            var pos: Vector3 = transform.localPosition;
            var off: Vector3 = this.offsets[i];
            var ran: Vector3 = this.moveRanges[i];
            pos.x = off.x + Math.sin(seed) * ran.x;
            pos.y = off.y + Math.sin(seed) * ran.y;
            pos.z = off.z + Math.sin(seed) * ran.z;
            transform.localPosition = pos;
        }
    }
}

export class MultiLight extends SingletonScene {
    s_scene: Laya.Scene3D;
    constructor() {
        super();
        //在Config3D中配置引擎所能接纳的最大光源的数量
        var c = new Config3D();
        c.maxLightCount = 16;
        //初始化引擎
        // Laya3D.init(0, 0, c);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // Stat.show();

        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/MultiLightScene/InventoryScene_Forest.ls", Handler.create(this, function (scene: Scene3D): void {
            this.s_scene = scene;
            this.AutoSetScene3d(this.s_scene);

            var camera: Camera = <Camera>scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            camera.transform.localPosition = new Vector3(8.937199060699333, 61.364798067809126, -66.77836086472654);

            var moveScript: LightMoveScript = camera.addComponent(LightMoveScript);
            var moverLights: LightSprite[] = moveScript.lights;
            var offsets: Vector3[] = moveScript.offsets;
            var moveRanges: Vector3[] = moveScript.moveRanges;
            moverLights.length = 15;
            for (var i: number = 0; i < 15; i++) {
                //添加点光源，和原来的添加点光源方式无异
                var pointLight: PointLight = (<PointLight>scene.addChild(new PointLight()));
                pointLight.range = 2.0 + Math.random() * 8.0;
                pointLight.color.setValue(Math.random(), Math.random(), Math.random());
                pointLight.intensity = 6.0 + Math.random() * 8;
                moverLights[i] = pointLight;
                offsets[i] = new Vector3((Math.random() - 0.5) * 10, pointLight.range * 0.75, (Math.random() - 0.5) * 10);
                moveRanges[i] = new Vector3((Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40);
            }

            //添加一个聚光灯，和原来的添加聚光灯方式无异
            var spotLight: SpotLight = (<SpotLight>scene.addChild(new SpotLight()));
            spotLight.transform.localPosition = new Vector3(0.0, 9.0, -35.0);
            spotLight.transform.localRotationEuler = new Vector3(-15.0, 180.0, 0.0);
            spotLight.color.setValue(Math.random(), Math.random(), Math.random());
            spotLight.range = 50;
            spotLight.intensity = 15;
            spotLight.spotAngle = 60;

        }));

    }
}

