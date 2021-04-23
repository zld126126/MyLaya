;window.fairygui = window.fgui = {};import UI_UIMainScene from "../UI/UIMainScene/UIMainScene";
export default class MainController {
    constructor() {
        this.IsChange = false;
        this.Title = "";
        this.Author = "";
        fgui.UIPackage.loadPackage("res/ui/UIMainScene", Laya.Handler.create(this, this.onUILoaded));
        Laya.timer.frameLoop(1, this, this.Update);
    }
    onUILoaded() {
        this._ui = UI_UIMainScene.createInstance();
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
