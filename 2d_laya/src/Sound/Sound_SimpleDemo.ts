import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Text = Laya.Text;
import Event = Laya.Event;
import SoundManager = Laya.SoundManager;
import Handler = Laya.Handler;

export class Sound_SimpleDemo extends SingletonScene {
    //声明一个信息文本
    private txtInfo: Text;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        var gap: number = 10;

        //创建一个Sprite充当音效播放按钮
        var soundButton: Sprite = this.createButton("播放音效");
        soundButton.x = (Laya.stage.width - soundButton.width * 2 + gap) / 2;
        soundButton.y = (Laya.stage.height - soundButton.height) / 2;
        this.addChild(soundButton);

        //创建一个Sprite充当音乐播放按钮
        var musicButton: Sprite = this.createButton("播放音乐");
        musicButton.x = soundButton.x + gap + soundButton.width;
        musicButton.y = soundButton.y;
        this.addChild(musicButton);

        soundButton.on(Event.CLICK, this, this.onPlaySound);
        musicButton.on(Event.CLICK, this, this.onPlayMusic);
    }

    private createButton(label: string): Sprite {
        var w: number = 110;
        var h: number = 40;

        var button: Sprite = new Sprite();
        button.size(w, h);
        button.graphics.drawRect(0, 0, w, h, "#FF7F50");
        button.graphics.fillText(label, w / 2, 8, "25px SimHei", "#FFFFFF", "center");
        this.addChild(button);
        return button;
    }

    private onPlayMusic(e: Event): void {
        console.log("播放音乐");
        SoundManager.playMusic("res/sounds/bgm.mp3", 1, new Handler(this, this.onComplete));
    }

    private onPlaySound(e: Event): void {
        console.log("播放音效");
        SoundManager.playSound("res/sounds/btn.mp3", 1, new Handler(this, this.onComplete));
    }

    private onComplete(): void {
        console.log("播放完成");
    }

    public Hide() {
        SoundManager.stopSound("res/sounds/btn.mp3");
        SoundManager.stopSound("res/sounds/bgm.mp3");
        this.visible = false;
    }
}