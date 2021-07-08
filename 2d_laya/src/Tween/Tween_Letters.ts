import SingletonScene from "../SingletonScene";
import Text = Laya.Text;
import Ease = Laya.Ease;
import Tween = Laya.Tween;

export class Tween_Letters extends SingletonScene {
    letters: Text[] = [];
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        var demoString: string = "LayaBox";

        for (var i: number = 0, len: number = demoString.length; i < len; ++i) {
            var letterText: Text = this.createLetter(demoString.charAt(i));
            this.letters.push(letterText);
        }
    }

    private MoveLetter(): void {
        var w: number = 400;
        var offset: number = Laya.stage.width - w >> 1;
        var endY: number = Laya.stage.height / 2 - 50;

        for (var i = 0; i < this.letters.length; i++) {
            this.letters[i].x = w / this.letters.length * i + offset;
            this.letters[i].y = 0;
            Tween.to(this.letters[i], { y: endY }, 1000, Ease.elasticOut, null, i * 1000);
        }
    }

    private createLetter(char: string): Text {
        var letter: Text = new Text();
        letter.text = char;
        letter.color = "#FFFFFF";
        letter.font = "Impact";
        letter.fontSize = 110;
        this.addChild(letter);

        return letter;
    }

    public Show(){
        this.visible = true;
        this.MoveLetter();
    }

}