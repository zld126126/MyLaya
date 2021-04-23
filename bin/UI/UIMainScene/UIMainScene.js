;window.fairygui = window.fgui = {};/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
export default class UIMainScene extends fgui.GComponent {
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
