import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class ChangeMesh extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private sphere: Laya.MeshSprite3D;
    private changeActionButton: Laya.Button;
    private index = 0;
    private sphereMesh: Laya.Mesh;
    private box: Laya.Mesh;
    private capsule: Laya.Mesh;
    private cylinder: Laya.Mesh;
    private cone: Laya.Mesh;
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // //显示性能面板
        // Laya.Stat.show();

        //初始化变量
        this.sphere = null;
        this.box = null;
        this.capsule = null;
        this.cylinder = null;
        this.cone = null;
        this.changeActionButton = null;
        this.index = 0;

        //预加载所有资源
        var resource = [GlobalConfig.ResPath + "res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls"];
        Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
    }
    onPreLoadFinish() {
        //初始化3D场景
        this.s_scene = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls");
        //获取相机
        var camera = this.s_scene.getChildByName("Main Camera");
        //为相机添加视角控制组件(脚本)
        camera.addComponent(CameraMoveScript);
        //获取球型精灵
        this.sphere = this.s_scene.getChildByName("Sphere") as Laya.MeshSprite3D;
        //获取精灵的mesh
        this.sphereMesh = this.sphere.meshFilter.sharedMesh;
        //新建四个mesh
        this.box = Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5);
        this.capsule = Laya.PrimitiveMesh.createCapsule(0.25, 1, 10, 20);
        this.cylinder = Laya.PrimitiveMesh.createCylinder(0.25, 1, 20);
        this.cone = Laya.PrimitiveMesh.createCone(0.25, 0.75);
        //加载UI
        this.loadUI();
    }
    loadUI() {

        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);
            this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换Mesh"));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);

            this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                this.index++;
                if (this.index % 5 === 1) {
                    //切换mesh
                    this.sphere.meshFilter.sharedMesh = this.box;
                }
                else if (this.index % 5 === 2) {
                    //切换mesh
                    this.sphere.meshFilter.sharedMesh = this.capsule;
                }
                else if (this.index % 5 === 3) {
                    //切换mesh
                    this.sphere.meshFilter.sharedMesh = this.cylinder;
                }
                else if (this.index % 5 === 3) {
                    //切换mesh
                    this.sphere.meshFilter.sharedMesh = this.cone;
                }
                else {
                    //切换mesh
                    this.sphere.meshFilter.sharedMesh = this.sphereMesh;
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