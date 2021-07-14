export class MultiplePassOutlineMaterial extends Laya.Material {
    static ALBEDOTEXTURE: any;
    static OUTLINECOLOR: any;
    static OUTLINEWIDTH: any;
    static OUTLINELIGHTNESS: any;
    /**
     * @private
     */
    static __init__() {
    }
    /**
     * èŽ·å–æ¼«åå°„è´´å›¾ã€‚
     * @return æ¼«åå°„è´´å›¾ã€‚
     */
    get albedoTexture() {
        return this._shaderValues.getTexture(MultiplePassOutlineMaterial.ALBEDOTEXTURE);
    }

    /**
     * è®¾ç½®æ¼«åå°„è´´å›¾ã€‚
     * @param value æ¼«åå°„è´´å›¾ã€‚
     */
    set albedoTexture(value) {
        this._shaderValues.setTexture(MultiplePassOutlineMaterial.ALBEDOTEXTURE, value);
    }
    /**
     * èŽ·å–çº¿æ¡é¢œè‰²
     * @return çº¿æ¡é¢œè‰²
     */
    get outlineColor() {
        return this._shaderValues.getVector(MultiplePassOutlineMaterial.OUTLINECOLOR);
    }

    set outlineColor(value) {
        this._shaderValues.setVector(MultiplePassOutlineMaterial.OUTLINECOLOR, value);
    }
    /**
     * èŽ·å–è½®å»“å®½åº¦ã€‚
     * @return è½®å»“å®½åº¦,èŒƒå›´ä¸º0åˆ°0.05ã€‚
     */
    get outlineWidth() {
        return this._shaderValues.getNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH);
    }

    /**
     * è®¾ç½®è½®å»“å®½åº¦ã€‚
     * @param value è½®å»“å®½åº¦,èŒƒå›´ä¸º0åˆ°0.05ã€‚
     */
    set outlineWidth(value) {
        value = Math.max(0.0, Math.min(0.05, value));
        this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH, value);
    }

    /**
     * èŽ·å–è½®å»“äº®åº¦ã€‚
     * @return è½®å»“äº®åº¦,èŒƒå›´ä¸º0åˆ°1ã€‚
     */
    get outlineLightness() {
        return this._shaderValues.getNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS);
    }

    /**
     * è®¾ç½®è½®å»“äº®åº¦ã€‚
     * @param value è½®å»“äº®åº¦,èŒƒå›´ä¸º0åˆ°1ã€‚
     */
    set outlineLightness(value) {
        value = Math.max(0.0, Math.min(1.0, value));
        this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS, value);
    }


    static initShader() {
        MultiplePassOutlineMaterial.__init__();
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
        };
        var uniformMap = {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_OutlineWidth': Laya.Shader3D.PERIOD_MATERIAL,
            'u_OutlineColor': Laya.Shader3D.PERIOD_MATERIAL,
            'u_OutlineLightness': Laya.Shader3D.PERIOD_MATERIAL,
            'u_AlbedoTexture': Laya.Shader3D.PERIOD_MATERIAL
        };

        var customShader = Laya.Shader3D.add("MultiplePassOutlineShader");
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        customShader.addSubShader(subShader);
        let vs1 = `
        attribute vec4 a_Position;
        attribute vec3 a_Normal;
        
        uniform mat4 u_MvpMatrix; 
        uniform float u_OutlineWidth;

        
        void main() 
        {
           vec4 position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0);
           gl_Position = u_MvpMatrix * position;
        }`;

        let ps1 = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
           precision mediump float;
        #endif
        uniform vec4 u_OutlineColor; 
        uniform float u_OutlineLightness;
    
        void main()
        {
           vec3 finalColor = u_OutlineColor.rgb * u_OutlineLightness;
           gl_FragColor = vec4(finalColor,0.0); 
        }`;

        var pass1 = subShader.addShaderPass(vs1, ps1);
        pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
        let vs2 = `
        #include "Lighting.glsl"

        attribute vec4 a_Position; 
        attribute vec2 a_Texcoord0;
        
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        
        attribute vec3 a_Normal; 
        varying vec3 v_Normal; 
        varying vec2 v_Texcoord0; 
        
        void main() 
        {
           gl_Position = u_MvpMatrix * a_Position;
           mat3 worldMat=mat3(u_WorldMat); 
           v_Normal=worldMat*a_Normal; 
           v_Texcoord0 = a_Texcoord0;
           gl_Position=remapGLPositionZ(gl_Position); 
        }`;
        let ps2 = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        varying vec2 v_Texcoord0;
        varying vec3 v_Normal;
        
        uniform sampler2D u_AlbedoTexture;
        
        
        void main()
        {
           vec4 albedoTextureColor = vec4(1.0);
           
           albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);
           gl_FragColor=albedoTextureColor;
        }`;

        subShader.addShaderPass(vs2, ps2);
    }



    constructor() {
        super();
        this.setShaderName("MultiplePassOutlineShader");
        this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH, 0.01581197);
        this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS, 1);
        this._shaderValues.setVector(MultiplePassOutlineMaterial.OUTLINECOLOR, new Laya.Vector4(1.0, 1.0, 1.0, 0.0));
        MultiplePassOutlineMaterial.ALBEDOTEXTURE = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
        MultiplePassOutlineMaterial.OUTLINECOLOR = Laya.Shader3D.propertyNameToID("u_OutlineColor");
        MultiplePassOutlineMaterial.OUTLINEWIDTH = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
        MultiplePassOutlineMaterial.OUTLINELIGHTNESS = Laya.Shader3D.propertyNameToID("u_OutlineLightness");
    }
}




