import Singleton from "../Singleton";
import { Sprite_DisplayImage } from "./Sprite_DisplayImage";
import { Sprite_ScreenShot } from "./Sprite_ScreenShot";
import { Sprite_Container } from "./Sprite_Container";

export class SpriteMain extends Singleton{
    private btnImgArr: Array<string> = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
    private btnNameArr: Array<string> = ["显示图片", "屏幕截图", "容器"];
    
    LoadExamples(){
        for (let index = 0; index < this.btnImgArr.length; index++) {
			this.createButton(this.btnImgArr[index], this.btnNameArr[index], this._onclick, index);
		}
    }

    // 创建按钮
	private createButton(skin: string, name: string, cb: Function, index: number): Laya.Button {
        var btn: Laya.Button = new Laya.Button(skin, name);
        // todo 等待后期优化 一个界面一个
		Laya.stage.addChild(btn);
		btn.on(Laya.Event.CLICK, this, cb, [name]);
		btn.size(60, 30);
		btn.name = name;
		btn.right = 10;
		btn.top = index * (btn.height + 10);
		return btn;
    }
    
    // 绑定点击事件
	private _onclick(name: string) {
		switch (name) {
			case this.btnNameArr[0]:
				Sprite_DisplayImage.getInstance().Click();
				break;
			case this.btnNameArr[1]:
				Sprite_ScreenShot.getInstance().Click();
				break;
			case this.btnNameArr[2]:
				Sprite_Container.getInstance().Click();
				break;
		}
		console.log(name + "-被点击");
	}
}