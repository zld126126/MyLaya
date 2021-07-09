import SingletonScene from "../SingletonScene";
import Browser = Laya.Browser;

export class Network_ProtocolBuffer extends SingletonScene {
    private ProtoBuf: any = Browser.window.protobuf;

    constructor() {
        super();
        Laya.stage.addChild(this);
        console.log(Browser.window.protobuf);
        this.ProtoBuf.load("res/protobuf/user.proto", this.onAssetsLoaded);
    }

    private onAssetsLoaded(err:any, root:any):void
		{
			if (err)
				throw err;

            // todo 以后实现    
            console.log("proto name:",root.nested.template.Login.name);
		}
}