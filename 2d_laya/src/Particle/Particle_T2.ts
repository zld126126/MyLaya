import SingletonScene from "../SingletonScene";
import Stage = Laya.Stage;
import Loader = Laya.Loader;
import Particle2D = Laya.Particle2D;
import ParticleSetting = Laya.ParticleSetting;
import Browser = Laya.Browser;
import Handler = Laya.Handler;
import Stat = Laya.Stat;
import WebGL = Laya.WebGL;
import URL = Laya.URL;

export class Particle_T2 extends SingletonScene {
    private sp: Particle2D;

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load("res/particles/RadiusMode.part", Handler.create(this, this.onAssetsLoaded), null, Loader.JSON);
    }

    public onAssetsLoaded(settings: ParticleSetting): void {
        this.sp = new Particle2D(settings);
        this.sp.emitter.start();
        this.sp.play();
        this.addChild(this.sp);

        this.sp.x = Laya.stage.width / 2;
        this.sp.y = Laya.stage.height / 2;
    }

    public Show() {
        this.visible = true;
    }

    public Hide() {
        this.visible = false;
    }
}