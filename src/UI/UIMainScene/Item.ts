/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class Item extends fgui.GComponent {

	public m_Pos:fgui.Controller;
	public m_n0:fgui.GGraph;
	public m_Title_Left:fgui.GTextField;
	public m_Title_Right:fgui.GTextField;
	public static URL:string = "ui://fadwlk6prn116";

	public static createInstance():Item {
		return <Item>(fgui.UIPackage.createObject("UIMainScene", "Item"));
	}

	protected onConstruct():void {
		this.m_Pos = this.getControllerAt(0);
		this.m_n0 = <fgui.GGraph>(this.getChildAt(0));
		this.m_Title_Left = <fgui.GTextField>(this.getChildAt(1));
		this.m_Title_Right = <fgui.GTextField>(this.getChildAt(2));
	}
}