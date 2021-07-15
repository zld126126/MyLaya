import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Script3D = Laya.Script3D;
import Vector3 = Laya.Vector3;
import Sprite3D = Laya.Sprite3D;
import Event = Laya.Event;
import MouseManager = Laya.MouseManager;
import Scene3D = Laya.Scene3D;
import Text = Laya.Text;
import Browser = Laya.Browser;
import MeshSprite3D = Laya.MeshSprite3D;
import Handler = Laya.Handler;

/**
 * model rotation script.
 */
class RotationScript extends Script3D {
    private _lastMouseX: number;
    private _mouseDown: boolean = false;
    private _rotate: Vector3 = new Vector3();
    private _autoRotateSpeed: Vector3 = new Vector3(0, 0.25, 0);

    model: Sprite3D;

    constructor() {
        super();
        Laya.stage.on(Event.MOUSE_DOWN, this, function (): void {
            this._mouseDown = true;
            this._lastMouseX = MouseManager.instance.mouseX;
        });
        Laya.stage.on(Event.MOUSE_UP, this, function (): void {
            this._mouseDown = false;
        });

    }
    onUpdate(): void {
        if (this._mouseDown) {
            var deltaX: number = MouseManager.instance.mouseX - this._lastMouseX;
            this._rotate.y = deltaX * 0.2;
            this.model.transform.rotate(this._rotate, false, false);
            this._lastMouseX = MouseManager.instance.mouseX;
        }
        else {
            this.model.transform.rotate(this._autoRotateSpeed, false, false);
        }
    }
}

export class DamagedHelmetModelShow extends SingletonScene {
    private txts: Laya.Text[] = [];

    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;


        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_DamagedHelmetScene/Conventional/DamagedHelmetScene.ls", Handler.create(this, function (scene: Scene3D): void {
            this.AutoSetScene3d(scene);

            var damagedHelmet: MeshSprite3D = <MeshSprite3D>scene.getChildAt(1).getChildAt(0);
            var rotationScript: RotationScript = damagedHelmet.addComponent(RotationScript);
            rotationScript.model = damagedHelmet;

            var size: number = 20;
            this.addText(size, size * 4, "Drag the screen to rotate the model.", "#F09900");
            size = 10;
            this.addText(size, Laya.stage.height - size * 4, "Battle Damaged Sci-fi Helmet by theblueturtle_    www.leonardocarrion.com", "#FFFF00");
        }));
    }

    /**
     * add text.
     */
    addText(size: number, y: number, text: string, color: string): void {
        var cerberusText: Text = new Text();
        cerberusText.color = color;
        cerberusText.fontSize = size * Browser.pixelRatio;
        cerberusText.x = size;
        cerberusText.y = y;
        cerberusText.text = text;
        Laya.stage.addChild(cerberusText);
        this.txts.push(cerberusText);
    }

    public Show() {
        super.Show();
        for (var i = 0; i < this.txts.length; i++) {
            this.txts[i].visible = true;
        }
    }

    public Hide() {
        super.Hide();
        for (var i = 0; i < this.txts.length; i++) {
            this.txts[i].visible = false;
        }
    }
}