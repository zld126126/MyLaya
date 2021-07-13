import SingletonScene from "../SingletonScene";
import { CameraMoveScript } from "../common/CameraMoveScript"
import { GlobalConfig } from "../GlobalConfig";
import { EventManager, EventType } from "../EventManager";
export class Sprite3DParent extends SingletonScene {
    private sprite3D: Laya.Sprite3D;
    private s_scene: Laya.Scene3D;
    private btns: Laya.Button[] = [];
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // //显示性能面板
        // Laya.Stat.show();

        //创建场景
        this.s_scene = new Laya.Scene3D();
        //Laya.stage.addChild(this.scene);

        //创建相机
        var camera = new Laya.Camera(0, 0.1, 100);
        this.s_scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //添加光照
        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

        //预加载所有资源
        var resource = [
            GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey2/LayaMonkey.lh",
            GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"];
        Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
    }
    public onPreLoadFinish() {
        this.AutoSetScene3d(this.s_scene);

        //添加父级猴子
        var layaMonkeyParent = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Laya.Sprite3D;
        //克隆猴子，作为子猴子
        var layaMonkeySon = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey2/LayaMonkey.lh") as Laya.Sprite3D;
        layaMonkeySon.transform.translate(new Laya.Vector3(2.5, 0, 0));
        //缩放
        var scale = new Laya.Vector3(0.5, 0.5, 0.5);
        layaMonkeySon.transform.localScale = scale;

        layaMonkeyParent.addChild(layaMonkeySon);

        this.addBtn(30, 100, 50, 20, "移动父级猴子", 10, function (e: Event): void {
            layaMonkeyParent.transform.translate(new Laya.Vector3(-0.1, 0, 0));
        });
        this.addBtn(30, 120, 50, 20, "放大父级猴子", 10, function (e: Event): void {
            var scale = new Laya.Vector3(0.2, 0.2, 0.2);
            layaMonkeyParent.transform.localScale = scale;
        });
        this.addBtn(30, 140, 50, 20, "旋转父级猴子", 10, function (e: Event): void {
            layaMonkeyParent.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        });

        this.addBtn(30, 160, 50, 20, "移动子级猴子", 10, function (e: Event): void {
            layaMonkeySon.transform.translate(new Laya.Vector3(-0.1, 0, 0));
        });
        this.addBtn(30, 180, 50, 20, "放大子级猴子", 10, function (e: Event): void {
            var scale = new Laya.Vector3(1, 1, 1);
            layaMonkeySon.transform.localScale = scale;
        });
        this.addBtn(30, 200, 50, 20, "旋转子级猴子", 10, function (e: Event): void {
            layaMonkeySon.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        });
    }

    private addBtn(x: number, y: number, width: number, height: number, text: string, size, clickFun: Function): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function (): void {
            var changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text)) as Laya.Button;
            changeActionButton.size(width, height);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = size;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(x, y);
            changeActionButton.on(Laya.Event.CLICK, this, clickFun);
            this.btns.push(changeActionButton);
        }));
    }

    public Show() {
        super.Show();
        for (var i = 0; i < this.btns.length; i++) {
            this.btns[i].visible = true;
        }
    }

    public Hide() {
        super.Hide();
        for (var i = 0; i < this.btns.length; i++) {
            this.btns[i].visible = false;
        }
    }

}