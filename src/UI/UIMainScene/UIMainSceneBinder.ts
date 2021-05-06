/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import Refresh from "./Refresh";
import UIMainScene from "./UIMainScene";
import Button1 from "./Button1";
import Button2 from "./Button2";
import Item from "./Item";

export default class UIMainSceneBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(Refresh.URL, Refresh);
		fgui.UIObjectFactory.setExtension(UIMainScene.URL, UIMainScene);
		fgui.UIObjectFactory.setExtension(Button1.URL, Button1);
		fgui.UIObjectFactory.setExtension(Button2.URL, Button2);
		fgui.UIObjectFactory.setExtension(Item.URL, Item);
	}
}