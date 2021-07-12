import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class CameraLookAt extends SingletonScene {
    private index = 0;
    private camera: Laya.Camera;
    private box: Laya.MeshSprite3D;
    private capsule: Laya.MeshSprite3D;
    private cylinder: Laya.MeshSprite3D;
    private upVector: Laya.Vector3 = new Laya.Vector3(0, 1, 0);
    private changeActionButton: Laya.Button;
    constructor() {
        super();
        //初始化引擎
        Laya3D.init(1000, 500);
        //适配模式
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

        //开启统计信息
        Laya.Stat.show();
        //预加载所有资源
        var resource = [
            GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png",
            GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox3/skyBox3.lmat"];
        Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
    }

    private onPreLoadFinish() {
        //创建场景
        var scene = new Laya.Scene3D();
        // Laya.stage.addChild(scene);
        EventManager.DispatchEvent(EventType.BACKTOMAIN);
        EventManager.DispatchEvent(EventType.SETSCENE3D, scene);

        //创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
        this.camera = new Laya.Camera(0, 0.1, 100);
        this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
        this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);

        //相机设置清楚标记,使用固定颜色
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
        //使用默认颜色
        //this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
        //设置摄像机视野范围（角度）
        this.camera.fieldOfView = 60;
        //为相机添加视角控制组件(脚本)
        this.camera.addComponent(CameraMoveScript);
        scene.addChild(this.camera);

        //添加平行光
        var directionLight = new Laya.DirectionLight();
        scene.addChild(directionLight);
        //设置平行光颜色
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

        var sprite = new Laya.Sprite3D;
        scene.addChild(sprite);

        //正方体
        this.box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5));
        sprite.addChild(this.box);
        this.box.transform.position = new Laya.Vector3(1.5, 0.0, 2);
        this.box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);

        //胶囊体
        this.capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.25, 1, 10, 20));
        this.capsule.transform.position = new Laya.Vector3(-1.5, 0.0, 2);
        sprite.addChild(this.capsule);

        //圆柱
        this.cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(0.25, 1, 20));
        this.cylinder.transform.position = new Laya.Vector3(0.0, 0.0, 2);
        sprite.addChild(this.cylinder);

        //创建linnPhong材质
        var materialBill = new Laya.BlinnPhongMaterial;
        this.box.meshRenderer.material = materialBill;
        this.capsule.meshRenderer.material = materialBill;
        this.cylinder.meshRenderer.material = materialBill;
        //为材质加载纹理
        var tex = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png") as Laya.Texture2D;
        //设置反照率贴图
        materialBill.albedoTexture = tex;

        this.loadUI();
    }
    private loadUI(): void {

        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function (): void {

            this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换注视目标")) as Laya.Button;
            this.changeActionButton.size(200, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);

            this.changeActionButton.on(Laya.Event.CLICK, this, function (): void {
                this.index++;
                if (this.index % 3 === 1) {
                    //摄像机捕捉模型目标
                    this.camera.transform.lookAt(this.box.transform.position, this.upVector);
                }
                else if (this.index % 3 === 2) {
                    //摄this.changeActionButton像机捕捉模型目标
                    this.camera.transform.lookAt(this.cylinder.transform.position, this.upVector);
                }
                else {
                    //摄像机捕捉模型目标
                    this.camera.transform.lookAt(this.capsule.transform.position, this.upVector);
                }
            });

        }));
    }

    public Show() {
        super.Show();
        this.changeActionButton.visible = true;
    }

    public Hide() {
        super.Hide();
        this.changeActionButton.visible = false;
    }
}