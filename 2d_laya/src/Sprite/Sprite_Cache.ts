import Sprite = Laya.Sprite;
import Text = Laya.Text;
import SingletonScene from "../SingletonScene";

export class Sprite_Cache extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        // 显示性能效果
        // Stat.show();
        this.createApe();
    }

    private createApe(): void {
        var textBox: Sprite = new Sprite();

        // 随机摆放文本
        var text: Text;
        for (var i: number = 0; i < 1000; i++) {
            text = new Text();
            text.fontSize = 20;
            text.text = (Math.random() * 100).toFixed(0);
            text.rotation = Math.random() * 360;
            text.color = "#CCCCCC";

            text.x = Math.random() * 600;
            text.y = Math.random() * 800;

            textBox.addChild(text);
        }

        //缓存为静态图像
        textBox.cacheAs = "bitmap";

        this.addChild(textBox);
    }
}