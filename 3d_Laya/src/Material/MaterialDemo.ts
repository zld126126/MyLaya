import { CameraMoveScript } from "../common/CameraMoveScript"
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
export class MaterialDemo extends SingletonScene {
    private sphere: Laya.MeshSprite3D;
    private pbrStandardMaterial: Laya.PBRStandardMaterial;
    private pbrTexture: Laya.Texture2D;
    private billinMaterial: Laya.BlinnPhongMaterial;
    private changeActionButton: Laya.Button;
    private index = 0;
    private s_scene: Laya.Scene3D;
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // //显示性能面板
        // Laya.Stat.show();

        this.sphere = null;
        this.pbrStandardMaterial = null;
        this.pbrTexture = null;
        this.billinMaterial = null;
        this.changeActionButton = null;
        this.index = 0;

        //预加载所有资源
        var resource = [
            GlobalConfig.ResPath + "res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls",
            GlobalConfig.ResPath + "res/threeDimen/texture/earth.png",];
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
        //获取球型精灵自带的BlinnPhong材质
        this.billinMaterial = this.sphere.meshRenderer.material as Laya.BlinnPhongMaterial;
        //创建一个新的PBRStandard材质
        this.pbrStandardMaterial = new Laya.PBRStandardMaterial();
        //获取新的纹理
        this.pbrTexture = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png");
        //为PBRStandard材质设置漫反射贴图
        this.pbrStandardMaterial.albedoTexture = this.pbrTexture;
        //加载UI
        this.loadUI();
    }
    loadUI() {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            this.AutoSetScene3d(this.s_scene);
            this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换材质"));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);

            this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                this.index++;
                if (this.index % 2 === 1) {
                    //切换至PBRStandard材质
                    this.sphere.meshRenderer.material = this.pbrStandardMaterial;
                }
                else {
                    //切换至BlinnPhong材质
                    this.sphere.meshRenderer.material = this.billinMaterial;
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
