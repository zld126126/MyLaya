export class CustomTerrainMaterial extends Laya.Material {
    static SPLATALPHATEXTURE: any;
    static DIFFUSETEXTURE1: any;
    static DIFFUSETEXTURE2: any;
    static DIFFUSETEXTURE3: any;
    static DIFFUSETEXTURE4: any;
    static DIFFUSETEXTURE5: any;
    static DIFFUSESCALE1: any;
    static DIFFUSESCALE2: any;
    static DIFFUSESCALE3: any;
    static DIFFUSESCALE4: any;
    static DIFFUSESCALE5: any;
    static SHADERDEFINE_DETAIL_NUM1: any;
    static SHADERDEFINE_DETAIL_NUM2: any;
    static SHADERDEFINE_DETAIL_NUM3: any;
    static SHADERDEFINE_DETAIL_NUM4: any;
    static SHADERDEFINE_DETAIL_NUM5: any;
    constructor() {
        super();
        this.setShaderName("CustomTerrainShader");
    }
    //ç»§æ‰¿è€Œæ¥çš„é™æ€å‡½æ•°
    static __init__() {
        //ES6å¯ä»¥å®šä¹‰é™æ€å±žæ€§ï¼Œè¿™äº›å±žæ€§æ˜¯CustomMaterialçš„å±žæ€§ï¼Œä¸å±žäºŽCustomMaterialå®žä¾‹çš„å±žæ€§ã€‚ES7ææ¡ˆå°†æ”¯æŒåœ¨classä¸­ä½¿ç”¨staticå®šä¹‰é™æ€å±žæ€§
        CustomTerrainMaterial.SPLATALPHATEXTURE = Laya.Shader3D.propertyNameToID("u_SplatAlphaTexture");
        CustomTerrainMaterial.DIFFUSETEXTURE1 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture1");
        CustomTerrainMaterial.DIFFUSETEXTURE2 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture2");
        CustomTerrainMaterial.DIFFUSETEXTURE3 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture3");
        CustomTerrainMaterial.DIFFUSETEXTURE4 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture4");
        CustomTerrainMaterial.DIFFUSETEXTURE5 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture5");
        CustomTerrainMaterial.DIFFUSESCALE1 = Laya.Shader3D.propertyNameToID("u_DiffuseScale1");
        CustomTerrainMaterial.DIFFUSESCALE2 = Laya.Shader3D.propertyNameToID("u_DiffuseScale2");
        CustomTerrainMaterial.DIFFUSESCALE3 = Laya.Shader3D.propertyNameToID("u_DiffuseScale3");
        CustomTerrainMaterial.DIFFUSESCALE4 = Laya.Shader3D.propertyNameToID("u_DiffuseScale4");
        CustomTerrainMaterial.DIFFUSESCALE5 = Laya.Shader3D.propertyNameToID("u_DiffuseScale5");
        //å£°æ˜Žæ³¨å†Œå®
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM1");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM2");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM3");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM4");
        CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM5");
    }
    //èŽ·å–splatAlphaè´´å›¾
    get splatAlphaTexture() {
        return this._shaderValues.getTexture(CustomTerrainMaterial.SPLATALPHATEXTURE);
    }
    //è®¾ç½®splatAlphaè´´å›¾
    set splatAlphaTexture(value) {
        this._shaderValues.setTexture(CustomTerrainMaterial.SPLATALPHATEXTURE, value);
    }
    //èŽ·å–ç¬¬ä¸€å±‚diffuseTexture
    get diffuseTexture1() {
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE1);
    }
    //è®¾ç½®ç¬¬ä¸€å±‚diffuseTexture
    set diffuseTexture1(value) {
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE1, value);
        this._setDetailNum(1);
    }
    //èŽ·å–ç¬¬äºŒå±‚è´´å›¾
    get diffuseTexture2() {
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE2);
    }
    //è®¾ç½®ç¬¬äºŒå±‚è´´å›¾ã€‚        
    set diffuseTexture2(value) {
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE2, value);
        this._setDetailNum(2);
    }
    //èŽ·å–ç¬¬ä¸‰å±‚è´´å›¾
    get diffuseTexture3() {
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE3);
    }
    //è®¾ç½®ç¬¬ä¸‰å±‚è´´å›¾
    set diffuseTexture3(value) {
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE3, value);
        this._setDetailNum(3);
    }
    //èŽ·å–ç¬¬å››å±‚è´´å›¾
    get diffuseTexture4() {
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE4);
    }
    //è®¾ç½®ç¬¬å››å±‚è´´å›¾
    set diffuseTexture4(value) {
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE4, value);
        this._setDetailNum(4);
    }
    //èŽ·å–ç¬¬äº”å±‚è´´å›¾
    get diffuseTexture5() {
        return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE5);
    }
    //è®¾ç½®ç¬¬å››å±‚è´´å›¾
    set diffuseTexture5(value) {
        this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE5, value);
        this._setDetailNum(5);
    }

    setDiffuseScale1(scale1) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE1, scale1);
    }
    setDiffuseScale2(scale2) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE2, scale2);
    }
    setDiffuseScale3(scale3) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE3, scale3);
    }
    setDiffuseScale4(scale4) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE4, scale4);
    }
    setDiffuseScale5(scale5) {
        this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE5, scale5);
    }

    _setDetailNum(value) {
        switch (value) {
            case 1:
                this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                break;
            case 2:
                this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                break;
            case 3:
                this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                break;
            case 4:
                this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                break;
            case 5:
                this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                break;
        }
    }
    static initShader() {
        CustomTerrainMaterial.__init__();
        let attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
        };
        let uniformMap = {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
            'u_SplatAlphaTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture1': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture2': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture3': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture4': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseTexture5': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale1': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale2': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale3': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale4': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseScale5': Laya.Shader3D.PERIOD_MATERIAL
        };
        let vs = `
            attribute vec4 a_Position;
            attribute vec2 a_Texcoord0;
            attribute vec3 a_Normal;
            uniform mat4 u_MvpMatrix;
            varying vec2 v_Texcoord0;
            void main()
            {
                gl_Position = u_MvpMatrix * a_Position;
                v_Texcoord0 = a_Texcoord0;
            }`;
        let ps = `
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            uniform sampler2D u_SplatAlphaTexture;
            uniform sampler2D u_DiffuseTexture1;
            uniform sampler2D u_DiffuseTexture2;
            uniform sampler2D u_DiffuseTexture3;
            uniform sampler2D u_DiffuseTexture4;
            uniform sampler2D u_DiffuseTexture5;
            uniform vec2 u_DiffuseScale1;
            uniform vec2 u_DiffuseScale2;
            uniform vec2 u_DiffuseScale3;
            uniform vec2 u_DiffuseScale4;
            uniform vec2 u_DiffuseScale5;
            varying vec2 v_Texcoord0;
            void main()
            {
                #ifdef CUSTOM_DETAIL_NUM1
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r;
                #elif  defined(CUSTOM_DETAIL_NUM2)
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r + color2.xyz * (1.0 - splatAlpha.r);
                #elif defined(CUSTOM_DETAIL_NUM3)
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
                    vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * (1.0 - splatAlpha.r - splatAlpha.g);
                #elif defined(CUSTOM_DETAIL_NUM4)
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
                    vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
                    vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b);
                #elif defined(CUSTOM_DETAIL_NUM5)
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
                    vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
                    vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
                    vec4 color5 = texture2D(u_DiffuseTexture5, v_Texcoord0 * u_DiffuseScale5);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * splatAlpha.a + color5.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b - splatAlpha.a);
                #else
                #endif
            }`;

        let customTerrianShader = Laya.Shader3D.add("CustomTerrainShader");
        let subShader = new Laya.SubShader(attributeMap, uniformMap);
        customTerrianShader.addSubShader(subShader);
        subShader.addShaderPass(vs, ps);
    }
}



