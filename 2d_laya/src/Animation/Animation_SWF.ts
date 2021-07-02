import MovieClip = Laya.MovieClip;
import SingletonScene from "../SingletonScene";

export class Animation_SWF extends SingletonScene {
    private SWFPath: string = "res/swf/dragon.swf";
    private MCWidth: number = 318;
    private MCHeight: number = 406;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createMovieClip();
    }

    private createMovieClip(): void {
        var mc: MovieClip = new MovieClip();
        mc.load(this.SWFPath);

        mc.x = (Laya.stage.width - this.MCWidth) / 2;
        mc.y = (Laya.stage.height - this.MCHeight) / 2;

        this.addChild(mc);
    }
}