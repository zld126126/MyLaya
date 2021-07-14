export class CustomMaterial extends Laya.Material {
    static DIFFUSETEXTURE: any;
    static MARGINALCOLOR: any;
    constructor() {
        super();
        this.setShaderName("CustomShader");
        CustomMaterial.DIFFUSETEXTURE = Laya.Shader3D.propertyNameToID("u_texture");
        CustomMaterial.MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");
    }
    //æ¼«åå°„è´´å›¾çš„å­˜å–å‡½æ•°
    get diffuseTexture() {
        return this._shaderValues.getTexture(CustomMaterial.DIFFUSETEXTURE);
    }
    set diffuseTexture(value) {
        this._shaderValues.setTexture(CustomMaterial.DIFFUSETEXTURE, value);
    }
    //è®¾ç½®marginalColorï¼ˆè¾¹ç¼˜å…‰ç…§é¢œè‰²ï¼‰
    set marginalColor(value) {
        this._shaderValues.setVector(CustomMaterial.MARGINALCOLOR, value);
    }

}