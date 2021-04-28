import Item from "../UI/UIMainScene/Item";
import UI_UIMainScene from "../UI/UIMainScene/UIMainScene";
import UIMainSceneBinder from "../UI/UIMainScene/UIMainSceneBinder";

export default class MainController{
    private _ui:UI_UIMainScene;
    private IsChange:boolean = false;
    private IsAdd:boolean = false;
    private Title:string = "";
    private Author:string = "";
    private ItemCount :number = 0;
    constructor() {
        fgui.UIPackage.loadPackage("res/ui/UIMainScene", Laya.Handler.create(this, this.onUILoaded)); 
        Laya.timer.frameLoop(1, this, this.Update);
    }

    onUILoaded() {
        this._ui = UI_UIMainScene.createInstance();
        this._ui.makeFullScreen();
        fgui.GRoot.inst.addChild(this._ui);
        console.log("页面加载成功");
        this._ui.m_Change.onClick(this,this.Change,["东宝","你好,世界！"]);
        this._ui.m_Add.onClick(this,this.Add);
        this._ui.m_ContentBox.itemRenderer = Laya.Handler.create(this, this.RenderItem, undefined, false);
        this._ui.m_ContentBox.numItems = this.ItemCount;
    }

    public Add(){
        this.IsAdd = true;
    }

    public AddItem(){
        this.IsAdd = false;
        this.ItemCount ++;
        this._ui.m_ContentBox.numItems  = this.ItemCount;
        if (this.ItemCount > 0){
            this._ui.m_ContentBox.scrollToView(this.ItemCount-1,true);
        }else{
            // 需要模拟下拉
        }
    }

    public RenderItem(index: number, obj: Item):void{
        let isLeft = index % 2 == 1;
        if (isLeft){
            obj.m_Pos.setSelectedIndex(0);
            obj.m_Title_Left.text = "这是第"+index+"行测试数据";
        }else{
            obj.m_Pos.setSelectedIndex(1);
            obj.m_Title_Right.text = "这是第"+index+"行测试数据";
        }

        let contentHeight = this._ui.m_ContentBox.scrollPane.contentHeight;
        let viewHeight = this._ui.m_ContentBox.scrollPane.viewHeight;
        if (contentHeight > viewHeight){
            console.log("内容高度应景超出视口高度");
            
        }
        console.log("内容高度:"+contentHeight+"视口高度:"+viewHeight);
    }
    
    public Change(author:string,title:string){
        console.log("点击了按钮");
        this.IsChange = true;
        this.Title = title;
        this.Author = author;
        console.log(author,title);
    }

    public ChangeContent(){
        this.IsChange = false;
        this._ui.m_Title.text = this.Title;
        this._ui.m_Author.text = this.Author;
        this._ui.m_ShowTransition.play(undefined,-1,0);
        this._ui.m_ShowTransition.timeScale = 1;
    }

    Update(){
        if (this.IsChange){
            this.ChangeContent();
        }

        if (this.IsAdd){
            this.AddItem();
        }
    }

    destroy() {
        this._ui.dispose();
    }
}