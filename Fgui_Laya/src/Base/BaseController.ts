import Singleton from "./Singleton";

export class BaseController extends Singleton{
    constructor() {
        super();
    }

    public init(path:string){
        console.log("BaseController init");
        fgui.UIPackage.loadPackage(path, Laya.Handler.create(this, this.onUILoaded)); 
        Laya.timer.frameLoop(1, this, this.Update);
    }
    
    public Update(){

    }

    public onUILoaded(){
        
    }
}