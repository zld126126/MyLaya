import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class CameraLayer extends SingletonScene {
    private changeActionButton: Laya.Button;
    private layerIndex;
    private camera: Laya.Camera;
    private s_scene: Laya.Scene3D;
    constructor() {
        super();
        this.changeActionButton = null;
        this.layerIndex = null;
        this.camera = null;
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // //显示性能面板
        // Laya.Stat.show();

        //创建场景
        this.s_scene = new Laya.Scene3D();
        //Laya.stage.addChild(this._scene);

        //添加相机
        this.camera = new Laya.Camera(0, 0.1, 100);
        this.s_scene.addChild(this.camera);
        this.camera.transform.translate(new Laya.Vector3(0, 0.7, 3));
        this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        //相机添加视角控制组件(脚本)
        this.camera.addComponent(CameraMoveScript);

        //移除所有图层
        this.camera.removeAllLayers();
        //添加显示图层(为相机添加一个蒙版)
        this.camera.addLayer(5);

        //添加平行光
        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

        Laya.loader.create([
            GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh",
            GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
        ], Laya.Handler.create(this, this.onComplete));
    }
    onComplete() {
        this.AutoSetScene3d(this.s_scene);
        //添加地面
        var grid: Laya.Sprite3D = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh")) as Laya.Sprite3D;
        //地面接收阴影
        (grid.getChildAt(0) as Laya.MeshSprite3D).meshRenderer.receiveShadow = true;
        //设置该精灵的蒙版为5(所属图层)
        (grid.getChildAt(0) as Laya.MeshSprite3D).layer = 5;

        //添加静态猴子
        var staticLayaMonkey = new Laya.MeshSprite3D(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm"));
        this.s_scene.addChild(staticLayaMonkey);
        //设置静态猴子的材质
        staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
        //设置静态猴子的蒙版为1(所属图层)
        staticLayaMonkey.layer = 1;
        staticLayaMonkey.transform.position = new Laya.Vector3(0, 0, 0.5);
        staticLayaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
        staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
        //产生阴影
        staticLayaMonkey.meshRenderer.castShadow = true;

        //克隆sprite3d
        var layaMonkey_clone1 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));
        var layaMonkey_clone2 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));
        var layaMonkey_clone3 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));

        //设置蒙版(所属图层)
        layaMonkey_clone1.layer = 2;
        layaMonkey_clone2.layer = 3;
        layaMonkey_clone3.layer = 0;
        //平移
        layaMonkey_clone1.transform.translate(new Laya.Vector3(1.5, 0, 0.0));
        layaMonkey_clone2.transform.translate(new Laya.Vector3(-1.5, 0, 0.0));
        layaMonkey_clone3.transform.translate(new Laya.Vector3(2.5, 0, 0.0));
        //旋转
        layaMonkey_clone2.transform.rotate(new Laya.Vector3(0, 60, 0), false, false);
        //缩放
        var scale = new Laya.Vector3(0.1, 0.1, 0.1);
        layaMonkey_clone3.transform.localScale = scale;

        //生成UI
        this.loadUI();
    }
    loadUI() {
        this.layerIndex = 0;
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换图层"));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                this.camera.removeAllLayers();
                this.layerIndex++;
                this.camera.addLayer(this.layerIndex % 4);
                this.camera.addLayer(5);

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