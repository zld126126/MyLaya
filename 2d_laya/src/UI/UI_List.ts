import SingletonScene from "../SingletonScene";
import List = Laya.List;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class UI_List extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        var list: List = new List();

        list.itemRender = Item;

        list.repeatX = 1;
        list.repeatY = 4;

        list.x = (Laya.stage.width - Item.WID) / 2;
        list.y = (Laya.stage.height - Item.HEI * list.repeatY) / 2;

        // 使用但隐藏滚动条
        list.vScrollBarSkin = "";

        list.selectEnable = true;
        list.selectHandler = new Handler(this, this.onSelect);

        list.renderHandler = new Handler(this, this.updateItem);
        this.addChild(list);

        // 设置数据项为对应图片的路径
        var data: Array<string> = [];
        for (var i: number = 0; i < 10; ++i) {
            data.push(GlobalConfig.ResPath + "res/ui/listskins/1.jpg");
            data.push(GlobalConfig.ResPath + "res/ui/listskins/2.jpg");
            data.push(GlobalConfig.ResPath + "res/ui/listskins/3.jpg");
            data.push(GlobalConfig.ResPath + "res/ui/listskins/4.jpg");
            data.push(GlobalConfig.ResPath + "res/ui/listskins/5.jpg");
        }
        list.array = data;
    }

    private updateItem(cell: Item, index: number): void {
        cell.setImg(cell.dataSource);
    }

    private onSelect(index: number): void {
        console.log("当前选择的索引：" + index);
    }
}

import Box = Laya.Box;
import Image = Laya.Image;
class Item extends Box {
    public static WID: number = 373;
    public static HEI: number = 85;

    private img: Image;

    constructor() {
        super();
        this.size(Item.WID, Item.HEI);
        this.img = new Image();
        this.addChild(this.img);
    }

    public setImg(src: string): void {
        this.img.skin = src;
    }
}