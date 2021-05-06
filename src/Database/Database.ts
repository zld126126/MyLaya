import Singleton from "../Base/Singleton";

export class Database extends Singleton {
    private SAVEDATA_KEY = "SAVEDATA";
    private json: JSON;
    public SAVEDATA = "";

    constructor() {
        super();
        //Laya.loader.load("res/json/test.json", Laya.Handler.create(this, this.onLoaded), null, Laya.Loader.JSON);
    }

    // 异步加载,需要等待加载完成才可以开始
    private onLoaded() {
        console.log("json onLoaded success");
        this.json = Laya.loader.getRes("res/json/test.json");
        console.log(this.json["name"]);
        console.log(this.json["age"]);
        console.log(this.json["sex"]);
        console.log(this.json["isChinese"]);
    }

    public PrintJson(){
        this.json = Laya.loader.getRes("res/json/test.json");
        console.log(this.json["name"]);
        console.log(this.json["age"]);
        console.log(this.json["sex"]);
        console.log(this.json["isChinese"]);
    }

    public SaveStorage() {
        var s = localStorage.getItem(this.SAVEDATA_KEY);
        console.log(s);
    }

    public LoadStorage() {
        localStorage.setItem(this.SAVEDATA_KEY, this.SAVEDATA);
    }

    public ResetStorage(): void {
        localStorage.removeItem(this.SAVEDATA_KEY);
    }
}