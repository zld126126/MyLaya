/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UIMainScene extends fgui.GComponent {

	public m_Bg:fgui.GGraph;
	public m_Title:fgui.GTextField;
	public m_Author:fgui.GTextField;
	public m_Change:fgui.GButton;
	public static URL:string = "ui://fadwlk6pjejj0";

	public static createInstance():UIMainScene {
		return <UIMainScene>(fgui.UIPackage.createObject("UIMainScene", "UIMainScene"));
	}

	protected onConstruct():void {
		this.m_Bg = <fgui.GGraph>(this.getChild("Bg"));
		this.m_Title = <fgui.GTextField>(this.getChild("Title"));
		this.m_Author = <fgui.GTextField>(this.getChild("Author"));
		this.m_Change = <fgui.GButton>(this.getChild("Change"));
	}
}