/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class Refresh extends fgui.GComponent {

	public m_Pos:fgui.Controller;
	public m_n0:fgui.GLoader;
	public static URL:string = "ui://fadwlk6pffoa9";

	public static createInstance():Refresh {
		return <Refresh>(fgui.UIPackage.createObject("UIMainScene", "Refresh"));
	}

	protected onConstruct():void {
		this.m_Pos = this.getControllerAt(0);
		this.m_n0 = <fgui.GLoader>(this.getChildAt(0));
	}
}