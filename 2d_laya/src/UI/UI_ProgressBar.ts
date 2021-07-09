import SingletonScene from "../SingletonScene";
import ProgressBar = Laya.ProgressBar;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class UI_ProgressBar extends SingletonScene {
    private progressBar: ProgressBar;

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load([GlobalConfig.ResPath + "res/ui/progressBar.png", GlobalConfig.ResPath + "res/ui/progressBar$bar.png"], Handler.create(this, this.onLoadComplete));
    }

    private onLoadComplete(): void {
        this.progressBar = new ProgressBar(GlobalConfig.ResPath + "res/ui/progressBar.png");

        this.progressBar.width = 400;

        this.progressBar.x = (Laya.stage.width - this.progressBar.width) / 2;
        this.progressBar.y = Laya.stage.height / 2;

        this.progressBar.sizeGrid = "5,5,5,5";
        this.progressBar.changeHandler = new Handler(this, this.onChange);
        this.addChild(this.progressBar);

        Laya.timer.loop(100, this, this.changeValue);
    }

    private changeValue(): void {
        if (!this.isShow) {
            return;
        }
        if (this.progressBar.value >= 1)
            this.progressBar.value = 0;
        this.progressBar.value += 0.05;
    }

    private onChange(value: number): void {
        if (!this.isShow) {
            return;
        }
        console.log("进度：" + Math.floor(value * 100) + "%");
    }
}