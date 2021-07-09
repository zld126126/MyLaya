import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Tween = Laya.Tween;
import { GlobalConfig } from "../GlobalConfig";

export class Tween_SimpleSample extends SingletonScene {
    characterA: Sprite;
    characterB: Sprite;
    terminalX: number;
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        this.terminalX = 200;

        this.characterA = this.createCharacter(GlobalConfig.ResPath + "res/cartoonCharacters/1.png");
        this.characterA.pivot(46.5, 50);
        this.characterA.y = 100;

        this.characterB = this.createCharacter(GlobalConfig.ResPath + "res/cartoonCharacters/2.png");
        this.characterB.pivot(34, 50);
        this.characterB.y = 250;

        this.graphics.drawLine(this.terminalX, 0, this.terminalX, Laya.stage.height, "#FFFFFF");

        // // characterA使用Tween.to缓动
        // Tween.to(this.characterA, { x: this.terminalX }, 1000);
        // // characterB使用Tween.from缓动
        // this.characterB.x = this.terminalX;
        // Tween.from(this.characterB, { x: 0 }, 1000);
        this.TweenMove();
    }

    private TweenMove() {
        this.terminalX = 200;
        if (this.characterA) {
            this.characterA.pivot(46.5, 50);
            this.characterA.y = 100;
            this.characterA.x = 0;
            // characterA使用Tween.to缓动
            Tween.to(this.characterA, { x: this.terminalX }, 1000);
        }

        if (this.characterB) {
            this.characterB.pivot(34, 50);
            this.characterB.y = 250;
            // characterB使用Tween.from缓动
            this.characterB.x = this.terminalX;
            Tween.from(this.characterB, { x: 0 }, 1000);
        }
    }

    private createCharacter(skin: string): Sprite {
        var character: Sprite = new Sprite();
        character.loadImage(skin);
        this.addChild(character);

        return character;
    }

    public Show() {
        this.visible = true;
        this.TweenMove();
    }
}