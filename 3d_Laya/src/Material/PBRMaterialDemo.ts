import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Vector3 = Laya.Vector3;
import Shader3D = Laya.Shader3D;
import Stage = Laya.Stage;
import Scene3D = Laya.Scene3D;
import Handler = Laya.Handler;
import Camera = Laya.Camera;
import Mesh = Laya.Mesh;
import PrimitiveMesh = Laya.PrimitiveMesh;
import Vector4 = Laya.Vector4;
import PBRStandardMaterial = Laya.PBRStandardMaterial;
import MeshSprite3D = Laya.MeshSprite3D;
import Transform3D = Laya.Transform3D;

export class PBRMaterialDemo extends SingletonScene {
    private static _tempPos: Vector3 = new Vector3();
    private s_scene: Laya.Scene3D;

    constructor() {
        super();
        Shader3D.debugMode = true;
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;

        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_EmptyScene/Conventional/EmptyScene.ls", Handler.create(this, function (scene: Scene3D): void {
            this.s_scene = scene;
            this.AutoSetScene3d(this.s_scene);
            //Laya.stage.addChild(scene);

            var camera: Camera = <Camera>scene.getChildByName("Main Camera");
            var moveScript: CameraMoveScript = camera.addComponent(CameraMoveScript);
            moveScript.rotaionSpeed = 0.005;

            var sphereMesh: Mesh = PrimitiveMesh.createSphere(0.25, 32, 32);
            const row: number = 6;
            this.addSpheresSpecialMetallic(sphereMesh, new Vector3(0, 1.5, 0), scene, row, new Vector4(186 / 255, 110 / 255, 64 / 255, 1.0), 1.0);
            this.addSpheresSmoothnessMetallic(sphereMesh, new Vector3(0, 0, 0), scene, 3, row, new Vector4(1.0, 1.0, 1.0, 1.0));
            this.addSpheresSpecialMetallic(sphereMesh, new Vector3(0, -1.5, 0), scene, row, new Vector4(0.0, 0.0, 0.0, 1.0), 0.0);
        }));
    }

    /**
     * Add one with smoothness and metallic sphere.
     */
    addPBRSphere(sphereMesh: Mesh, position: Vector3, scene: Scene3D, color: Vector4, smoothness: number, metallic: number): PBRStandardMaterial {
        var mat: PBRStandardMaterial = new PBRStandardMaterial();
        mat.albedoColor = color;
        mat.smoothness = smoothness;
        mat.metallic = metallic;

        var meshSprite: MeshSprite3D = new MeshSprite3D(sphereMesh);
        meshSprite.meshRenderer.sharedMaterial = mat;
        var transform: Transform3D = meshSprite.transform;
        transform.localPosition = position;
        scene.addChild(meshSprite);
        return mat;
    }


    /**
     * Add some different smoothness and metallic sphere.
     */
    addSpheresSmoothnessMetallic(sphereMesh: Mesh, offset: Vector3, scene: Scene3D, row: number, col: number, color: Vector4): void {
        const width: number = col * 0.5;
        const height: number = row * 0.5;
        for (var i: number = 0, n: number = col; i < n; i++) {//diffenent smoothness
            for (var j: number = 0, m: number = row; j < m; j++) {//diffenent metallic
                var smoothness: number = i / (n - 1);
                var metallic: number = 1.0 - j / (m - 1);

                var pos: Vector3 = PBRMaterialDemo._tempPos;
                pos.setValue(-width / 2 + i * width / (n - 1), height / 2 - j * height / (m - 1), 3.0);
                Vector3.add(offset, pos, pos);

                this.addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
            }
        }
    }

    /**
     * Add some different smoothness with special metallic sphere.
     */
    addSpheresSpecialMetallic(sphereMesh: Mesh, offset: Vector3, scene: Scene3D, col: number, color: Vector4, metallic: number = 0): void {
        const width: number = col * 0.5;
        for (var i: number = 0, n: number = col; i < n; i++) {//diffenent smoothness
            var smoothness: number = i / (n - 1);
            var metallic: number = metallic;

            var pos: Vector3 = PBRMaterialDemo._tempPos;
            pos.setValue(-width / 2 + i * width / (n - 1), 0, 3.0);
            Vector3.add(offset, pos, pos);

            this.addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
        }
    }
}