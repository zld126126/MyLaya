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
import AmbientMode = Laya.AmbientMode;
import Handler = Laya.Handler;
/**
 * model rotation script.
 */
class RotationScript extends Script3D {
    private _lastMouseX: number;
    private _mouseDown: boolean = false;
    private _rotate: Vector3 = new Vector3();

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
    }
}

export class CerberusModelShow extends SingletonScene {
    private txts: Laya.Text[] = [];
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        super();

        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_CerberusScene/Conventional/CerberusScene.ls", Handler.create(this, function (scene: Scene3D): void {
            this.AutoSetScene3d(scene);
            scene.ambientMode = AmbientMode.SphericalHarmonics;

            var model: Sprite3D = <Sprite3D>scene.getChildByName("Cerberus_LP");
            var rotationScript: RotationScript = model.addComponent(RotationScript);
            rotationScript.model = model;

            var size: number = 20;
            this.addText(size, size * 4, "Drag the screen to rotate the model.", "#F09900");
            size = 10;
            this.addText(size, Laya.stage.height - size * 4, "Cerberus by Andrew Maximov     http://artisaverb.info/PBT.html", "#FFFF00");
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
        this.txts.push(cerberusText);
        Laya.stage.addChild(cerberusText);
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



