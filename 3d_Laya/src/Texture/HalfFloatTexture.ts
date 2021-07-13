import { CameraMoveScript } from "../common/CameraMoveScript";
import SingletonScene from "../SingletonScene";
import Sprite3D = Laya.Sprite3D;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Vector4 = Laya.Vector4;
import MeshSprite3D = Laya.MeshSprite3D;
import PrimitiveMesh = Laya.PrimitiveMesh;
import DirectionLight = Laya.DirectionLight;
import Texture2D = Laya.Texture2D;
import BlinnPhongMaterial = Laya.BlinnPhongMaterial;
import Matrix4x4 = Laya.Matrix4x4;
import TextureFormat = Laya.TextureFormat;
import HalfFloatUtils = Laya.HalfFloatUtils;
import FilterMode = Laya.FilterMode;

export class HalfFloatTexture extends SingletonScene {
    private sprite3D: Sprite3D;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // Stat.show();
        var scene: Scene3D = new Scene3D();

        var camera: Camera = (<Camera>scene.addChild(new Camera(0, 0.1, 100)));
        camera.transform.translate(new Vector3(0, 2, 5));
        camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        camera.clearColor = new Vector4(0.2, 0.2, 0.2, 1.0);

        var directionLight: DirectionLight = (<DirectionLight>scene.addChild(new DirectionLight()));
        //设置平行光的方向
        var mat: Matrix4x4 = directionLight.transform.worldMatrix;
        mat.setForward(new Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;

        this.sprite3D = (<Sprite3D>scene.addChild(new Sprite3D()));

        //正方体
        var box: MeshSprite3D = (<MeshSprite3D>this.sprite3D.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(1, 1))));
        box.transform.position = new Vector3(0.0, 1.0, 2.5);
        box.transform.rotate(new Vector3(90, 0, 0), false, false);
        var material: BlinnPhongMaterial = new BlinnPhongMaterial();
        material.albedoTexture = this.createHalfFloatTexture();
        box.meshRenderer.sharedMaterial = material;
        this.AutoSetScene3d(scene);
    }

    //创建半浮点数纹理
    createHalfFloatTexture(): Texture2D {
        var texture: Texture2D = new Texture2D(50, 50, TextureFormat.R32G32B32A32, false, true);
        var pixelData: Uint16Array = new Uint16Array(50 * 50 * 4);
        var pixelIndex: number;
        var step: number = 1.0 / 50;
        for (var x: number = 0, n = 50; x < n; x++) {
            for (var y: number = 0, m = 50; y < m; y++) {
                pixelIndex = (x + y * 50) * 4;
                pixelData[pixelIndex] = HalfFloatUtils.roundToFloat16Bits(1.0);
                pixelData[pixelIndex + 1] = HalfFloatUtils.roundToFloat16Bits(x * step);
                pixelData[pixelIndex + 2] = HalfFloatUtils.roundToFloat16Bits(y * step);
                pixelData[pixelIndex + 3] = HalfFloatUtils.roundToFloat16Bits(1.0);
            }
        }
        texture.setPixels(pixelData, 0);
        texture.filterMode = FilterMode.Bilinear;
        return texture;
    }
}