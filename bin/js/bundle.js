(function () {
    'use strict';

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class UIMainScene extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("UIMainScene", "UIMainScene"));
        }
        onConstruct() {
            this.m_Bg = (this.getChild("Bg"));
            this.m_Title = (this.getChild("Title"));
            this.m_Author = (this.getChild("Author"));
            this.m_Change = (this.getChild("Change"));
        }
    }
    UIMainScene.URL = "ui://fadwlk6pjejj0";

    class MainController {
        constructor() {
            this.IsChange = false;
            this.Title = "";
            this.Author = "";
            fgui.UIPackage.loadPackage("res/ui/UIMainScene", Laya.Handler.create(this, this.onUILoaded));
            Laya.timer.frameLoop(1, this, this.Update);
        }
        onUILoaded() {
            this._ui = UIMainScene.createInstance();
            this._ui.makeFullScreen();
            fgui.GRoot.inst.addChild(this._ui);
            console.log("页面加载成功");
            this._ui.m_Change.onClick(this, this.SetChangeContent, ["东宝", "你好,世界！"]);
        }
        SetChangeContent(author, title) {
            console.log("点击了按钮");
            this.IsChange = true;
            this.Title = title;
            this.Author = author;
            console.log(author, title);
        }
        ChangeContent() {
            this.IsChange = false;
            this._ui.m_Title.text = this.Title;
            this._ui.m_Author.text = this.Author;
        }
        Update() {
            if (this.IsChange) {
                this.ChangeContent();
            }
        }
        destroy() {
            this._ui.dispose();
        }
    }

    class UIMainSceneBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(UIMainScene.URL, UIMainScene);
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            Laya.stage.addChild(fgui.GRoot.inst.displayObject);
            this.bindAllUI();
            new MainController();
        }
        bindAllUI() {
            UIMainSceneBinder.bindAll();
            console.log("UI绑定成功");
        }
    }
    new Main();

}());
