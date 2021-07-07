export const enum EventType {
    /**测试事件 */
    TESTEVENT = "TEST_EVENT",
    /**返回主页 */
    BACKTOMAIN = "BACKTOMAIN",
}

export class EventExtra {
    // handler列表
    private _handerList: Array<Laya.Handler>;

    constructor() {
        this._handerList = new Array<Laya.Handler>();
    }

    public Add(handler: Laya.Handler): void {
        this._handerList.push(handler);
    }

    public Remove(handler: Laya.Handler): void {
        for (let i: number = 0; i < this._handerList.length; i++) {
            if (handler.caller == this._handerList[i].caller && handler.method == this._handerList[i].method) {
                this._handerList[i].recover();
                this._handerList.splice(i, 1);
                handler.recover();
                return;
            }
        }
    }

    public Exec(args: any[]): void {
        for (let i: number = this._handerList.length; i >= 0; i--) {
            let handler: Laya.Handler = this._handerList[i];
            if (handler != null) {
                try {
                    handler.setTo(handler.caller, handler.method, args, false);
                    //  如果run 中出现异常 for 会停止  其他的类注册的事件则不会走
                    handler.run();
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
    }
}

export class EventManager {
    //事件列表
    private static eventMap: Map<string, EventExtra> = new Map();

    /**
     * 派发事件
     * @param type 消息类型
     * @param args 额外参数
     */
    public static DispatchEvent(type: string, args?: any): void {
        if (!(args instanceof Array))
            args = [args];

        let e: EventExtra | undefined = EventManager.eventMap.get(type);
        if (e != null || e != undefined) {
            try {
                e.Exec(args);
            }
            catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 注册事件
     * @param type 消息类型
     * @param handler 回调函数
     */
    public static RegistEvent(type: string, handler: Laya.Handler): void {
        let e: EventExtra | undefined = EventManager.eventMap.get(type);
        if (e == null || e == undefined) {
            e = new EventExtra();
            EventManager.eventMap.set(type, e);
        }
        e.Add(handler);
    }

    /**
     * 删除事件
     * @param type 消息类型
     * @param handler 回调函数
     */
    public static RemoveEvent(type: string, handler: Laya.Handler): void {
        let e: EventExtra | undefined = EventManager.eventMap.get(type);
        if (e != undefined && handler != null) {
            e.Remove(handler);
        }
    }
}