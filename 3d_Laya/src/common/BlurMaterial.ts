export class BlurMaterial extends Laya.Material {
    texelSize: any;
    doSamplevalue: any;
    static SHADERVALUE_DOWNSAMPLEVALUE: any;
    static SHADERVALUE_TEXELSIZE: any;
    static SHADERVALUE_SOURCETEXTURE0: any;
    static ShADERVALUE_SOURCETEXTURE1: any;
    static SHADERVALUE_MAINTEX: any;

    constructor(texelSize, offset) {
        super();
        this.texelSize = new Laya.Vector4();
        this.doSamplevalue = 0;
        this.setShaderName("blurEffect");
        this._shaderValues.setNumber(BlurMaterial.SHADERVALUE_DOWNSAMPLEVALUE, offset);
        this._shaderValues.setVector(BlurMaterial.SHADERVALUE_TEXELSIZE, texelSize);
        BlurMaterial.SHADERVALUE_MAINTEX = Laya.Shader3D.propertyNameToID("u_MainTex");
        BlurMaterial.SHADERVALUE_TEXELSIZE = Laya.Shader3D.propertyNameToID("u_MainTex_TexelSize");
        BlurMaterial.SHADERVALUE_DOWNSAMPLEVALUE = Laya.Shader3D.propertyNameToID("u_DownSampleValue");
        BlurMaterial.SHADERVALUE_SOURCETEXTURE0 = Laya.Shader3D.propertyNameToID("u_sourceTexture0");
        BlurMaterial.ShADERVALUE_SOURCETEXTURE1 = Laya.Shader3D.propertyNameToID("u_sourceTexture1");
    }
    
    sourceTexture(sourceTexture0, sourceTexture1) {
        this._shaderValues.setTexture(BlurMaterial.SHADERVALUE_SOURCETEXTURE0, sourceTexture0);
        this._shaderValues.setTexture(BlurMaterial.ShADERVALUE_SOURCETEXTURE1, sourceTexture1);
    }
}
