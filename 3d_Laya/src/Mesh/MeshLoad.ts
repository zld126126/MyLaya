import { Tool } from "../common/Tool";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class MeshLoad extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private changeActionButton: Laya.Button;
    private sprite3D: Laya.Sprite3D;
    private lineSprite3D: Laya.Sprite3D;
    private rotation: Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    private curStateIndex: number = 0;

    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();
        var camera: Laya.Camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);

        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);

        this.sprite3D = this.s_scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;
        this.lineSprite3D = this.s_scene.addChild(new Laya.Sprite3D()) as Laya.Sprite3D;

        Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh: Laya.Mesh): void {
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);

            var layaMonkey: Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            var layaMonkeyLineSprite3D: Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(5000)) as Laya.PixelLineSprite3D;
            Tool.linearModel(layaMonkey, layaMonkeyLineSprite3D, Laya.Color.GREEN);

            var plane: Laya.MeshSprite3D = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(6, 6, 10, 10))) as Laya.MeshSprite3D;
            plane.transform.position = new Laya.Vector3(0, 0, -1);
            var planeLineSprite3D: Laya.PixelLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(1000)) as Laya.PixelLineSprite3D;
            Tool.linearModel(plane, planeLineSprite3D, Laya.Color.GRAY);


            Laya.timer.frameLoop(1, this, function (): void {
                layaMonkeyLineSprite3D.transform.rotate(this.rotation, false);
                layaMonkey.transform.rotate(this.rotation, false);
            });

            this.lineSprite3D.active = false;
            this.loadUI();
        }));

    }

    private loadUI(): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function (): void {
            this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "正常模式")) as Laya.Button;
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