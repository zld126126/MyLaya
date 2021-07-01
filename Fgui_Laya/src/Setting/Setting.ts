import Singleton from "../Base/Singleton";

export class Setting extends Singleton {
    public IsDebug = true; // 是否开启debug
    public IsFullScreen = true; // 是否全屏
    public IsVerticalScreen = true; // 是否竖屏
    public IsSaveData = true; // 是否开启存档
}