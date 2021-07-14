import { CameraMoveScript } from "../common/CameraMoveScript";
import { ScalableAO } from "../common/ScalableAO";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import PostProcess = Laya.PostProcess;
import Shader3D = Laya.Shader3D;
import Vector3 = Laya.Vector3;
import DirectionLight = Laya.DirectionLight;
import Matrix4x4 = Laya.Matrix4x4;
import Sprite3D = Laya.Sprite3D;
import MeshSprite3D = Laya.MeshSprite3D;
import PrimitiveMesh = Laya.PrimitiveMesh;
import Mesh = Laya.Mesh;
import BlinnPhongMaterial = Laya.BlinnPhongMaterial;
import Button = Laya.Button;
import Browser = Laya.Browser;
import Event = Laya.Event;
import Handler = Laya.Handler;

export class ProstProcess_AO extends SingletonScene {
    s_scene: Scene3D;
    camera: Camera;
    postProcess: PostProcess;
    btn: Laya.Button;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;

        // Stat.show();
        Shader3D.debugMode = true;
        this.onResComplate();
    }

    onResComplate() {
        this.s_scene = new Scene3D();
        this.s_scene.ambientColor = new Vector3(1, 1, 1);
        var camera: Camera = (<Camera>this.s_scene.addChild(new Camera(0, 0.1, 1000)));
        camera.transform.translate(new Vector3(0, 1, 5));
        camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        this.camera = camera;
        var directionLight: DirectionLight = (<DirectionLight>this.s_scene.addChild(new DirectionLight()));
        //方向光的颜色
        directionLight.color.setValue(0.5, 0.5, 0.5);
        //设置平行光的方向
        var mat: Matrix4x4 = directionLight.transform.worldMatrix;
        mat.setForward(new Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;
        this.addObjectInScene(this.s_scene);
        this.addPostProcess(camera);
        this.loadUI();
    }

    /**
    * 场景添加测试对象
    * @param scene 
    */
    addObjectInScene(scene: Scene3D) {

        let sprite: Sprite3D = new Sprite3D();
        scene.addChild(sprite);

        let planeMesh: Mesh = PrimitiveMesh.createPlane(10, 10, 1, 1);
        let plane: MeshSprite3D = new MeshSprite3D(planeMesh);
        scene.addChild(plane);

        let cubeMesh: Mesh = PrimitiveMesh.createBox();
        let sphere: Mesh = PrimitiveMesh.createSphere(0.3);
        let cube0: MeshSprite3D = new MeshSprite3D(cubeMesh);
        let cube1: MeshSprite3D = new MeshSprite3D(cubeMesh);
        let cube2: MeshSprite3D = new MeshSprite3D(cubeMesh);
        let cube3: MeshSprite3D = new MeshSprite3D(cubeMesh);
        let sphere0: MeshSprite3D = new MeshSprite3D(sphere);
        let sphere1: MeshSprite3D = new MeshSprite3D(sphere);
        let sphere2: MeshSprite3D = new MeshSprite3D(sphere);
        let sphere3: MeshSprite3D = new MeshSprite3D(sphere);

        cube0.meshRenderer.sharedMaterial = new BlinnPhongMaterial;

        sprite.addChild(cube0);
        sprite.addChild(cube1);
        sprite.addChild(cube2);
        sprite.addChild(cube3);
        sprite.addChild(sphere0);
        sprite.addChild(sphere1);
        sprite.addChild(sphere2);
        sprite.addChild(sphere3);

        cube1.transform.position = new Vector3(-1, 0, 0);
        cube2.transform.position = new Vector3(-1, 0, 1);
        cube3.transform.position = new Vector3(-1, 1, 0);

        sphere0.transform.position = new Vector3(-3, 0, 0);
        sphere1.transform.position = new Vector3(2, 0, 0);
        sphere2.transform.position = new Vector3(2, 0.5, 0);
        sphere3.transform.position = new Vector3(-1, 0, 2);


    }

    addPostProcess(camera: Camera) {
        let postProcess: PostProcess = new PostProcess();
        camera.postProcess = postProcess;
        this.postProcess = postProcess;
        let ao: ScalableAO = new ScalableAO();
        ao.radius = 0.15;
        ao.aoColor = new Vector3(0.0, 0.0, 0.0);
        ao.instance = 0.5;
        postProcess.addEffect(ao);
    }

    /**
     *@private
     */
    loadUI(): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
            this.AutoSetScene3d(this.s_scene);
            this.btn = (<Button>Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "关闭AO")));
            this.btn.size(200, 40);
            this.btn.labelBold = true;
            this.btn.labelSize = 30;
            this.btn.sizeGrid = "4,4,4,4";
            this.btn.scale(Browser.pixelRatio, Browser.pixelRatio);
            this.btn.pos(Laya.stage.width / 2 - this.btn.width * Browser.pixelRatio / 2, Laya.stage.height - 60 * Browser.pixelRatio);
            this.btn.on(Event.CLICK, this, function (): void {
                var enableHDR: boolean = !!this.camera.postProcess;
                if (enableHDR) {
                    this.btn.label = "开启AO";
                    this.camera.postProcess = null;
                }
                else {
                    this.btn.label = "关闭AO";
                    this.camera.postProcess = this.postProcess;
                }
            });
        }));
    }

    public Show() {
        super.Show();
        if (this.btn) {
            this.btn.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.btn) {
            this.btn.visible = false;
        }
    }
}