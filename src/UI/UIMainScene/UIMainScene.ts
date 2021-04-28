/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import Button1 from "./Button1";
import Button2 from "./Button2";

export default class UIMainScene extends fgui.GComponent {

	public m_Bg:fgui.GGraph;
	public m_Title:fgui.GTextField;
	public m_Author:fgui.GTextField;
	public m_ContentBox:fgui.GList;
	public m_Change:Button1;
	public m_Add:Button2;
	public m_ShowTransition:fgui.Transition;
	public static URL:string = "ui://fadwlk6pjejj0";

	public static createInstance():UIMainScene {
		return <UIMainScene>(fgui.UIPackage.createObject("UIMainScene", "UIMainScene"));
	}

	protected onConstruct():void {
		this.m_Bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_Title = <fgui.GTextField>(this.getChildAt(1));
		this.m_Author = <fgui.GTextField>(this.getChildAt(2));
		this.m_ContentBox = <fgui.GList>(this.getChildAt(3));
		this.m_Change = <Button1>(this.getChildAt(4));
		this.m_Add = <Button2>(this.getChildAt(5));
		this.m_ShowTransition = this.getTransitionAt(0);
	}
}