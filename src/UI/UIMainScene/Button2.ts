/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class Button2 extends fgui.GButton {

	public m_button:fgui.Controller;
	public m_n0:fgui.GGraph;
	public m_n1:fgui.GGraph;
	public m_n2:fgui.GGraph;
	public m_title:fgui.GTextField;
	public static URL:string = "ui://fadwlk6prn114";

	public static createInstance():Button2 {
		return <Button2>(fgui.UIPackage.createObject("UIMainScene", "Button2"));
	}

	protected onConstruct():void {
		this.m_button = this.getControllerAt(0);
		this.m_n0 = <fgui.GGraph>(this.getChildAt(0));
		this.m_n1 = <fgui.GGraph>(this.getChildAt(1));
		this.m_n2 = <fgui.GGraph>(this.getChildAt(2));
		this.m_title = <fgui.GTextField>(this.getChildAt(3));
	}
}