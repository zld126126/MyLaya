import GameConfig from "./GameConfig";
import MainController from "./Biz/MainController";
import UIMainSceneBinder from "./UI/UIMainScene/UIMainSceneBinder";
import { Database } from "./Database/Database";
import { ResourceManager } from "./Asset/ResourcesManager";
import { EventManager, EventType } from "./Event/EventManager";
class Main {
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
		EventManager.RegistEvent(EventType.RESOURCE_READY, Laya.Handler.create(this, this.Ready));
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		var db = Database.getInstance();
		// ts/js 调用参考 https://www.jianshu.com/p/08d2c532a9fa
		window['Database'] = db;
		// ts调用js
		//window["TsCallJs"]("TsCallJs");
		//window["SaveJson"](`{"name":"dong","age":18}`,`test2.txt`)
		SaveJson(`{"name":"dong","age":18}`, `test2.txt`);
		ResourceManager.getInstance();
		//加载IDE指定的场景
		//GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		Laya.stage.addChild(fgui.GRoot.inst.displayObject);
		this.bindAllUI();
	}

	bindAllUI() {
		UIMainSceneBinder.bindAll();
		console.log("UI绑定成功");
	}

	Ready() {
		MainController.getInstance();
		// 展示粒子系统
		this.showParticle();
		//Database.getInstance().PrintJson();
	}

	showParticle(): void {
		Laya.loader.load("particle/TestParticle.part", new Laya.Handler(this, () => {
			// 获取粒子配置
			let setting: Laya.ParticleSetting = Laya.loader.getRes("particle/TestParticle.part");
			// 创造粒子
			let particle: Laya.Particle2D = new Laya.Particle2D(setting);
			particle.x = 500;
			particle.y = 500;
			Laya.stage.addChild(particle);
			// 播放粒子
			particle.play();

			// 每个粒子持续时间
			setting.duration = 10;
			// 修改最小开始半径
			setting.minStartRadius = 30;

			// 销毁粒子
			Laya.timer.once(2500, this, () => {
				particle.destroy();
			})
		}));
	}

}
//激活启动类
new Main();
