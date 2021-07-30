export class DOM_JSSCRIPT{
    constructor() {
        Laya.init(800, 600);
        Laya.stage.bgColor = "#FFFFFF";
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        
        this.RunJSCode("console.log('RunJSCode');");
    }

    /**
     * ts 直接运行js方法 替换import js后 调用 window['XXX']();的笨拙方式
     * @param code js方法体 类似 console.log();
     * @returns 
     */
    RunJSCode(code: string){
        var laya = window['Laya'];
        if (laya != null){
            try{
                Function('"use strict";(()=>{'+code+'})()')();
            }catch(error){
                console.log(error);
                return;
            }
            console.log("运行成功:",code);
        }
    }
}