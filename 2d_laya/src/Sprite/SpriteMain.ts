import SingletonMainScene from "../SingletonMainScene";
import { Sprite_DisplayImage } from "./Sprite_DisplayImage";
import { Sprite_ScreenShot } from "./Sprite_ScreenShot";
import { Sprite_Container } from "./Sprite_Container";
import { Sprite_RoateAndScale } from "./Sprite_RoateAndScale";
import { Sprite_DrawPath } from "./Sprite_DrawPath";
import { Sprite_MagnifyingGlass } from "./Sprite_MagnifyingGlass";
import { Sprite_DrawShapes } from "./Sprite_DrawShapes";
import { Sprite_Cache } from "./Sprite_Cache";
import { Sprite_NodeControl } from "./Sprite_NodeControl";
import { Sprite_Pivot } from "./Sprite_Pivot";
import { Sprite_SwitchTexture } from "./Sprite_SwitchTexture";
import { Sprite_Guide } from "./Sprite_Guide";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";

export class SpriteMain extends SingletonMainScene {
	constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

	private btnNameArr: Array<string> = [
		"返回主页","显示图片", "屏幕截图", "容器", "旋转缩放", "绘制路径", "遮罩_放大镜",
		"绘制形状", "缓存静态图像", "节点控制", "轴心点", "切换纹理", "新手引导"];

	// 加载例子
	LoadExamples() {
		for (let index = 0; index < this.btnNameArr.length; index++) {
			this.createButton(this.btnNameArr[index], this._onclick, index);
		}
	}

	/**
	 * 
	 * @param name 按钮名称
	 * @param cb 绑定方法
	 * @param index index游标
	 * @param skin 按钮皮肤
	 */
	private createButton(name: string, cb: Function, index: number, skin: string = GlobalConfig.ResPath + "res/threeDimen/ui/button.png"): Laya.Button {
		var btn: Laya.Button = new Laya.Button(skin, name);
		btn.on(Laya.Event.CLICK, this, cb, [name]);
        btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
		btn.size(50, 20);
		btn.name = name;
		btn.right = 5;
		btn.top = index * (btn.height + 5);
		this.addChild(btn);
		return btn;
	}

	// 绑定点击事件
	private _onclick(name: string) {
		switch (name) {
			case this.btnNameArr[0]:
				this.Hide();
                EventManager.DispatchEvent(EventType.BACKTOMAIN);
                break;
			case this.btnNameArr[1]:
				Sprite_DisplayImage.getInstance().Click();
				break;
			case this.btnNameArr[2]:
				Sprite_ScreenShot.getInstance().Click();
				break;
			case this.btnNameArr[3]:
				Sprite_Container.getInstance().Click();
				break;
			case this.btnNameArr[4]:
				Sprite_RoateAndScale.getInstance().Click();
				break;
			case this.btnNameArr[5]:
				Sprite_DrawPath.getInstance().Click();
				break;
			case this.btnNameArr[6]:
				Sprite_MagnifyingGlass.getInstance().Click();
				break;
			case this.btnNameArr[7]:
				Sprite_DrawShapes.getInstance().Click();
				break;
			case this.btnNameArr[8]:
				Sprite_Cache.getInstance().Click();
				break;
			case this.btnNameArr[9]:
				Sprite_NodeControl.getInstance().Click();
				break;
			case this.btnNameArr[10]:
				Sprite_Pivot.getInstance().Click();
				break;
			case this.btnNameArr[11]:
				Sprite_SwitchTexture.getInstance().Click();
				break;
			case this.btnNameArr[12]:
				Sprite_Guide.getInstance().Click();
				break;
		}
		console.log(name + "按钮_被点击");
	}
}