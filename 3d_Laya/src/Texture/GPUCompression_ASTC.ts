import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import UnlitMaterial = Laya.UnlitMaterial;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Vector4 = Laya.Vector4;
import MeshSprite3D = Laya.MeshSprite3D;
import PrimitiveMesh = Laya.PrimitiveMesh;
import Browser = Laya.Browser;
import Texture2D = Laya.Texture2D;
import Handler = Laya.Handler;

export class GPUCompression_ASTC extends SingletonScene {
	private s_scene: Laya.Scene3D;
	private mat: UnlitMaterial;
	constructor() {
		super();
		// Laya3D.init(0, 0);
		// Laya.stage.scaleMode = Stage.SCALE_FULL;
		// Laya.stage.screenMode = Stage.SCREEN_NONE;
		// Stat.show();

		this.s_scene = new Scene3D();

		var camera: Camera = (<Camera>this.s_scene.addChild(new Camera(0, 0.1, 100)));
		camera.transform.translate(new Vector3(0, 2, 5));
		camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		camera.clearColor = new Vector4(0.2, 0.2, 0.2, 1.0);

		let meshSprite = new MeshSprite3D(PrimitiveMesh.createBox());
		this.mat = new UnlitMaterial();
		this.s_scene.addChild(meshSprite);
		meshSprite.meshRenderer.sharedMaterial = this.mat;
		if (!Browser.onAndroid && !Browser.onIOS) {
			console.log("PC不支持ASTC纹理");
			return;
		}

		Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/ASTC4x4Test.ktx", Handler.create(this, function (texture: Texture2D): void {
			this.mat.albedoTexture = texture;
			//修改材质贴图的平铺和偏移
			this.AutoSetScene3d(this.s_scene);
		}));


	}
}