import Sprite = Laya.Sprite;
import SingletonScene from "../SingletonScene";

export class Sprite_DrawPath extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.drawPentagram();
    }

    private drawPentagram(): void {
        var canvas: Sprite = new Sprite();
        this.addChild(canvas);

        var path: Array<number> = [];
        path.push(0, -130);
        path.push(33, -33);
        path.push(137, -30);
        path.push(55, 32);
        path.push(85, 130);
        path.push(0, 73);
        path.push(-85, 130);
        path.push(-55, 32);
        path.push(-137, -30);
        path.push(-33, -33);

        canvas.graphics.drawPoly(Laya.stage.width / 2, Laya.stage.height / 2, path, "#FF7F50");
    }
}