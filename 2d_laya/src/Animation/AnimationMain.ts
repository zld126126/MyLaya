import Singleton from "../Singleton";
import { Animation_SWF } from "./Animation_SWF";
import { Animation_Altas } from "./Animation_Altas";

export class AnimationMain extends Singleton {
    private btnNameArr: Array<string> = [
        "SWF动画", "图集动画"];

    // 加载例子
    LoadExamples() {
        for (let index = 0; index < this.btnNameArr.length; index++) {
            this.createButton(this.btnNameArr[index], this._onclick, index);
        }
    }

	/**
	 * 
	 * @param name 按钮名称
	 * @param cb 绑定方法
	 * @param index index游标
	 * @param skin 按钮皮肤
	 */
    private createButton(name: string, cb: Function, index: number, skin: string = "res/threeDimen/ui/button.png"): Laya.Button {
        var btn: Laya.Button = new Laya.Button(skin, name);
        // todo 等待后期优化 一个界面一个
        Laya.stage.addChild(btn);
        btn.on(Laya.Event.CLICK, this, cb, [name]);
        btn.size(50, 20);
        btn.name = name;
        btn.right = 5;
        btn.top = index * (btn.height + 5);
        return btn;
    }

    // 绑定点击事件
    private _onclick(name: string) {
        switch (name) {
            case this.btnNameArr[0]:
                Animation_SWF.getInstance().Click();
                break;
            case this.btnNameArr[1]:
                Animation_Altas.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}