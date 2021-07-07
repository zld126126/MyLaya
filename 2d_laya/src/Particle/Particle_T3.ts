import SingletonScene from "../SingletonScene";
import Loader = Laya.Loader;
import Particle2D = Laya.Particle2D;
import ParticleSetting = Laya.ParticleSetting;
import Handler = Laya.Handler;

export class Particle_T3 extends SingletonScene {
    private sp: Particle2D;

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load("res/particles/particleNew.part", Handler.create(this, this.onAssetsLoaded), null, Loader.JSON);
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