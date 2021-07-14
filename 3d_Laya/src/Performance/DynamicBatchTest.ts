//2019.0.17 8.00PM

import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

//PC:
//机型:Surface Pro 6     CPU:I5-8250U 	  GPU:Intel UHD Graphics 620    平台:chrome:75.0.3770.90     分辨率:外接1080P显示器 Chrome全屏    帧率：43-45

//Mobile
//机型:Mi note 3   		 CPU:骁龙660      GPU:CPU集成                    平台：chrome 71.0.3578.99    分辨率:横屏                         帧率： 16-17
//机型:Mi Mix3       	 CPU:骁龙845 	  GPU:CPU集成                    平台:chrome:72.0.3626.105    分辨率:横屏                         帧率：16-19 
//机型:Mi 9        		 CPU:骁龙855 	  GPU:CPU集成                    平台:chrome:75.0.3770.89     分辨率:横屏                         帧率：52-55     

import Vector3 = Laya.Vector3;
import Camera = Laya.Camera;
import Texture2D = Laya.Texture2D;
import Matrix4x4 = Laya.Matrix4x4;
import PrimitiveMesh = Laya.PrimitiveMesh;
import BlinnPhongMaterial = Laya.BlinnPhongMaterial;
import MeshSprite3D = Laya.MeshSprite3D;
import Mesh = Laya.Mesh;
import Handler = Laya.Handler;

export class DynamicBatchTest extends SingletonScene {
    s_scene: Laya.Scene3D;
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        super();

        this.s_scene = new Laya.Scene3D();
        this.s_scene.ambientColor = new Vector3(1, 1, 1);

        var camera: Camera = (<Camera>this.s_scene.addChild(new Camera(0, 0.1, 1000)));
        camera.transform.translate(new Vector3(0, 6.2, 10.5));
        camera.transform.rotate(new Vector3(-40, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);



        Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/layabox.png", Handler.create(this, function (tex: Texture2D): void {
            this.AutoSetScene3d(this.s_scene);

            var radius: Vector3 = new Vector3(0, 0, 1);
            var radMatrix: Matrix4x4 = new Matrix4x4();
            var circleCount: number = 50;

            var boxMesh: Mesh = PrimitiveMesh.createBox(0.02, 0.02, 0.02);
            var boxMat: BlinnPhongMaterial = new BlinnPhongMaterial();
            boxMat.albedoTexture = tex;
            for (var i: number = 0; i < circleCount; i++) {
                radius.z = 1.0 + i * 0.15;
                radius.y = i * 0.03;
                var oneCircleCount: number = 100 + i * 15;
                for (var j: number = 0; j < oneCircleCount; j++) {
                    var boxSprite: MeshSprite3D = new MeshSprite3D(boxMesh);
                    boxSprite.meshRenderer.sharedMaterial = boxMat;
                    var localPos: Vector3 = boxSprite.transform.localPosition;
                    var rad: number = ((Math.PI * 2) / oneCircleCount) * j;
                    Matrix4x4.createRotationY(rad, radMatrix);
                    Vector3.transformCoordinate(radius, radMatrix, localPos);
                    boxSprite.transform.localPosition = localPos;
                    this.s_scene.addChild(boxSprite);
                }
            }
        }));
    }

}

