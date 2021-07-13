import { CameraMoveScript } from "../common/CameraMoveScript";
import { Tool } from "../common/Tool";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class CustomMesh extends SingletonScene {
    private changeActionButton: Laya.Button;
    private s_scene: Laya.Scene3D;
    private sprite3D: Laya.Sprite3D;
    private lineSprite3D: Laya.Sprite3D;
    private curStateIndex = 0;

    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();

        var camera = new Laya.Camera(0, 0.1, 100);
        this.s_scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 2, 5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;

        this.sprite3D = new Laya.Sprite3D();
        this.s_scene.addChild(this.sprite3D);
        this.lineSprite3D = new Laya.Sprite3D();
        this.s_scene.addChild(this.lineSprite3D);

        //正方体
        var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5));
        this.sprite3D.addChild(box);
        box.transform.position = new Laya.Vector3(2.0, 0.25, 0.6);
        box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        //为正方体添加像素线渲染精灵
        var boxLineSprite3D = new Laya.PixelLineSprite3D(100);
        this.lineSprite3D.addChild(boxLineSprite3D);
        //设置像素线渲染精灵线模式
        Tool.linearModel(box, boxLineSprite3D, Laya.Color.GREEN);

        //球体
        var sphere = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.25, 20, 20));
        this.sprite3D.addChild(sphere);
        sphere.transform.position = new Laya.Vector3(1.0, 0.25, 0.6);
        var sphereLineSprite3D = new Laya.PixelLineSprite3D(3500);
        this.lineSprite3D.addChild(sphereLineSprite3D);
        Tool.linearModel(sphere, sphereLineSprite3D, Laya.Color.GREEN);

        //圆柱体
        var cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(0.25, 1, 20));
        this.sprite3D.addChild(cylinder);
        cylinder.transform.position = new Laya.Vector3(0, 0.5, 0.6);
        var cylinderLineSprite3D = new Laya.PixelLineSprite3D(1000);
        this.lineSprite3D.addChild(cylinderLineSprite3D);
        Tool.linearModel(cylinder, cylinderLineSprite3D, Laya.Color.GREEN);

        //胶囊体
        var capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.25, 1, 10, 20));
        this.sprite3D.addChild(capsule);
        capsule.transform.position = new Laya.Vector3(-1.0, 0.5, 0.6);
        var capsuleLineSprite3D = new Laya.PixelLineSprite3D(3000);
        this.lineSprite3D.addChild(capsuleLineSprite3D);
        Tool.linearModel(capsule, capsuleLineSprite3D, Laya.Color.GREEN);

        //圆锥体
        var cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(0.25, 0.75));
        this.sprite3D.addChild(cone);
        cone.transform.position = new Laya.Vector3(-2.0, 0.375, 0.6);
        var coneLineSprite3D = new Laya.PixelLineSprite3D(500);
        this.lineSprite3D.addChild(coneLineSprite3D);
        Tool.linearModel(cone, coneLineSprite3D, Laya.Color.GREEN);


        //平面
        var plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(6, 6, 10, 10));
        this.sprite3D.addChild(plane);
        var planeLineSprite3D = new Laya.PixelLineSprite3D(1000);
        this.lineSprite3D.addChild(planeLineSprite3D);
        Tool.linearModel(plane, planeLineSprite3D, Laya.Color.GRAY);

        this.lineSprite3D.active = false;
        this.loadUI();
    }



    private loadUI(): void {
        Laya.loader.load([GlobalConfig.ResPath + "/res/threeDimen/ui/button.png"], Laya.Handler.create(this, function (): void {
            this.AutoSetScene3d(this.s_scene);
            this.changeActionButton = new Laya.Button(GlobalConfig.ResPath + "/res/threeDimen/ui/button.png", "正常模式");
            Laya.stage.addChild(this.changeActionButton);
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            this.changeActionButton.on(Laya.Event.CLICK, this, function (): void {
                if (++this.curStateIndex % 2 == 1) {
                    this.sprite3D.active = false;
                    this.lineSprite3D.active = true;
                    this.changeActionButton.label = "网格模式";
                } else {
                    this.sprite3D.active = true;
                    this.lineSprite3D.active = false;
                    this.changeActionButton.label = "正常模式";
                }
            });
        }));
    }

    public Show() {
        super.Show();
        if (this.changeActionButton) {
            this.changeActionButton.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.changeActionButton) {
            this.changeActionButton.visible = false;
        }
    }
}