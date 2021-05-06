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
            this.m_Bg = (this.getChildAt(0));
            this.m_Title = (this.getChildAt(1));
            this.m_Author = (this.getChildAt(2));
            this.m_ContentBox = (this.getChildAt(3));
            this.m_Change = (this.getChildAt(4));
            this.m_Add = (this.getChildAt(5));
            this.m_ShowTransition = this.getTransitionAt(0);
        }
    }
    UIMainScene.URL = "ui://fadwlk6pjejj0";

    class MainController {
        constructor() {
            this.IsChange = false;
            this.IsAdd = false;
            this.Title = "";
            this.Author = "";
            this.ItemCount = 0;
            fgui.UIPackage.loadPackage("res/ui/UIMainScene", Laya.Handler.create(this, this.onUILoaded));
            Laya.timer.frameLoop(1, this, this.Update);
        }
        onUILoaded() {
            this._ui = UIMainScene.createInstance();
            this._ui.makeFullScreen();
            fgui.GRoot.inst.addChild(this._ui);
            console.log("页面加载成功");
            this._ui.m_Change.onClick(this, this.Change, ["东宝", "你好,世界！"]);
            this._ui.m_Add.onClick(this, this.Add);
            this._ui.m_ContentBox.itemRenderer = Laya.Handler.create(this, this.RenderItem, undefined, false);
            this._ui.m_ContentBox.numItems = this.ItemCount;
        }
        Add() {
            this.IsAdd = true;
        }
        AddItem() {
            this.IsAdd = false;
            this.ItemCount++;
            if (this.ItemCount > 0) {
                this._ui.m_ContentBox.numItems = this.ItemCount;
                this._ui.m_ContentBox.scrollToView(this.ItemCount - 1, true);
            }
        }
        RenderItem(index, obj) {
            let isLeft = index % 2 == 1;
            if (isLeft) {
                obj.m_Pos.setSelectedIndex(0);
                obj.m_Title_Left.text = "这是第" + index + "行测试数据";
            }
            else {
                obj.m_Pos.setSelectedIndex(1);
                obj.m_Title_Right.text = "这是第" + index + "行测试数据";
            }
        }
        Change(author, title) {
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
            this._ui.m_ShowTransition.play(undefined, 1, 0);
            this._ui.m_ShowTransition.timeScale = 1;
        }
        Update() {
            if (this.IsChange) {
                this.ChangeContent();
            }
            if (this.IsAdd) {
                this.AddItem();
            }
        }
        destroy() {
            this._ui.dispose();
        }
    }

    class Refresh extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("UIMainScene", "Refresh"));
        }
        onConstruct() {
            this.m_Pos = this.getControllerAt(0);
            this.m_n0 = (this.getChildAt(0));
        }
    }
    Refresh.URL = "ui://fadwlk6pffoa9";

    class Button1 extends fgui.GButton {
        static createInstance() {
            return (fgui.UIPackage.createObject("UIMainScene", "Button1"));
        }
        onConstruct() {
            this.m_button = this.getControllerAt(0);
            this.m_n0 = (this.getChildAt(0));
            this.m_n1 = (this.getChildAt(1));
            this.m_n2 = (this.getChildAt(2));
            this.m_title = (this.getChildAt(3));
        }
    }
    Button1.URL = "ui://fadwlk6pl3b22";

    class Button2 extends fgui.GButton {
        static createInstance() {
            return (fgui.UIPackage.createObject("UIMainScene", "Button2"));
        }
        onConstruct() {
            this.m_button = this.getControllerAt(0);
            this.m_n0 = (this.getChildAt(0));
            this.m_n1 = (this.getChildAt(1));
            this.m_n2 = (this.getChildAt(2));
            this.m_title = (this.getChildAt(3));
        }
    }
    Button2.URL = "ui://fadwlk6prn114";

    class Item extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("UIMainScene", "Item"));
        }
        onConstruct() {
            this.m_Pos = this.getControllerAt(0);
            this.m_n0 = (this.getChildAt(0));
            this.m_Title_Left = (this.getChildAt(1));
            this.m_Title_Right = (this.getChildAt(2));
        }
    }
    Item.URL = "ui://fadwlk6prn116";

    class UIMainSceneBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(Refresh.URL, Refresh);
            fgui.UIObjectFactory.setExtension(UIMainScene.URL, UIMainScene);
            fgui.UIObjectFactory.setExtension(Button1.URL, Button1);
            fgui.UIObjectFactory.setExtension(Button2.URL, Button2);
            fgui.UIObjectFactory.setExtension(Item.URL, Item);
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
