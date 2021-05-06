import Singleton from "../Base/Singleton";
import { EventManager, EventType } from "../Event/EventManager";

export class ResourceManager extends Singleton {
    //数据类型和资源地址
    private res: Array<any> = [
        {url:"res/json/test.json",type:Laya.Loader.JSON},
        //{ url: "res/atlas/ui.json", type: Laya.Loader.ATLAS },
        //{ url: "res/atlas/ui.png", type: Laya.Loader.IMAGE },  
        //{ url: "res/atlas/bg.mp3", type: Laya.Loader.SOUND },
        //{ url: "res/atlas/hit.wav", type: Laya.Loader.SOUND }
    ];

    constructor(){
        super();
        Laya.loader.load(this.res,null,Laya.Handler.create(this,this.onProgress,null,false));
    }

    onProgress(){
        console.log("Resource load success");
        EventManager.DispatchEvent(EventType.RESOURCE_READY);
    }
}