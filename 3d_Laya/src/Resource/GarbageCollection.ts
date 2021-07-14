import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class GarbageCollection extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private changeActionButton: Laya.Button;
    private castType;

    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        this.castType = 0;
        this.s_scene = null;

        this.loadScene();
        this.addBtn(200, 200, 160, 40, "释放显存", function (e) {
            this.castType++;
            this.castType %= 2;
            switch (this.castType) {
                case 0:
                    (e.target).label = "释放显存";
                    this.loadScene();
                    break;
                case 1:
                    (e.target).label = "加载场景";
                    if (this.s_scene)//_scene不为空表示场景已加载完成
                        this.garbageCollection();
                    break;
            }
        });
    }
    private addBtn(x: number, y: number, width: number, height: number, text: string, clickFun: Function): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text)) as Laya.Button;
            this.changeActionButton.size(width, height);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(x, y);
            this.changeActionButton.on(Laya.Event.CLICK, this, clickFun);
        }));
    }
    private loadScene(): void {
        Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/ParticleScene/Example_01.ls", Laya.Handler.create(this, function (scene: Laya.Scene3D) {
            this.s_scene = scene;
            this.AutoSetScene3d(this.s_scene);
            var camera: Laya.Camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 1, 0));
            camera.addComponent(CameraMoveScript);
        }));
    }
    private garbageCollection(): void {
        this.s_scene.destroy();//销毁场景
        this.s_scene = null;
        Laya.Resource.destroyUnusedResources();//销毁无用资源(没有被场景树引用,并且没有加资源锁的)
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

