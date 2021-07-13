import { CameraMoveScript } from "../common/CameraMoveScript";
import { Tool } from "../common/Tool";
import { EventManager, EventType } from "../EventManager";
import SingletonScene from "../SingletonScene";

export class PixelLineSprite3DDemo extends SingletonScene{
	private sprite3D: Laya.Sprite3D;
	private lineSprite3D: Laya.Sprite3D;
	private s_scene: Laya.Scene3D;

	constructor() {
		// Laya3D.init(0, 0);
		// Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		// Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		// Laya.Stat.show();

		super();
		this.s_scene = new Laya.Scene3D();

		var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
		camera.transform.translate(new Laya.Vector3(0, 2, 5));
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		camera.addComponent(CameraMoveScript);
		camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);

		var directionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
		//设置平行光的方向
		var mat = directionLight.transform.worldMatrix as Laya.Matrix4x4;
		mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		directionLight.transform.worldMatrix = mat;

		this.sprite3D = this.s_scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;
		this.lineSprite3D = this.s_scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;

		//球体
		var sphere = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.25, 20, 20))) as Laya.MeshSprite3D;
		sphere.transform.position = new Laya.Vector3(0.0, 0.75, 2);
		var sphereLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(3500)) as Laya.PixelLineSprite3D;
		Tool.linearModel(sphere, sphereLineSprite3D, Laya.Color.GREEN);
		this.sprite3D.active = false;;
		this.lineSprite3D.active = true;

		EventManager.DispatchEvent(EventType.BACKTOMAIN);
        EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);
	}


}
