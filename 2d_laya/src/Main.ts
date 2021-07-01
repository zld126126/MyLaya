import GameConfig from "./GameConfig";
import { Sprite_DisplayImage } from "./Sprite/Sprite_DisplayImage";
import { Sprite_ScreenShot } from "./Sprite/Sprite_ScreenShot";
class Main {
	private btnImgArr: Array<string> = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
	private btnNameArr: Array<string> = ["显示图片", "屏幕截图", "容器"];

	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	}

	// 加载例子
	public LoadExample() {
		for (let index = 0; index < this.btnImgArr.length; index++) {
			this.createButton(this.btnImgArr[index], this.btnNameArr[index], this._onclick, index);
		}
	}

	// 创建按钮
	private createButton(skin: string, name: string, cb: Function, index: number): Laya.Button {
		var btn: Laya.Button = new Laya.Button(skin, name);
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
				break;
		}
		console.log(name + "-被点击");
	}
}
//激活启动类
new Main().LoadExample();
