
export var EdgeMode;
(function (EdgeMode) {
    EdgeMode[EdgeMode["ColorEdge"] = 0] = "ColorEdge";
    EdgeMode[EdgeMode["NormalEdge"] = 1] = "NormalEdge";
    EdgeMode[EdgeMode["DepthEdge"] = 2] = "DepthEdge";
})(EdgeMode || (EdgeMode = {}));

var EdgeEffectVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_PositionTexcoord;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}\r\n";

var EdgeEffectFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\n\r\nuniform vec4 u_DepthBufferParams;\r\n\r\nuniform vec3 u_EdgeColor;\r\n\r\n#ifdef DEPTHEDGE\r\n    uniform float u_Depthhold;\r\n#endif\r\n\r\n#ifdef NORMALEDGE\r\n    uniform float u_NormalHold;\r\n#endif\r\n\r\n#ifdef COLOREDGE\r\n    uniform float u_ColorHold;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\n#ifdef DEPTHNORMAL\r\n    uniform sampler2D u_DepthNormalTex;\r\n    void getDepthNormal(out float depth, out vec3 normal){\r\n        vec4 col = texture2D(u_DepthNormalTex, v_Texcoord0);\r\n        DecodeDepthNormal(col, depth, normal);\r\n    }\r\n\r\n    float getDepth(vec2 uv) {\r\n        float depth;\r\n        vec3 normal;\r\n        vec4 col = texture2D(u_DepthNormalTex, uv);\r\n        DecodeDepthNormal(col, depth, normal);\r\n        return depth;\r\n    }\r\n\r\n    vec3 getNormal(vec2 uv) {\r\n        float depth;\r\n        vec3 normal;\r\n        vec4 col = texture2D(u_DepthNormalTex, uv);\r\n        DecodeDepthNormal(col, depth, normal);\r\n        return normal;\r\n    }\r\n\r\n#endif\r\n\r\n#ifdef DEPTH\r\n    uniform sampler2D u_DepthTex;\r\n    float getDepth(vec2 uv) {\r\n        float depth = texture2D(u_DepthTex, uv).r;\r\n        depth = Linear01Depth(depth, u_DepthBufferParams);\r\n        return depth;\r\n    }\r\n#endif\r\n\r\nvoid SobelSample(in vec2 uv,out vec3 colorG, out vec3 normalG, out vec3 depthG) {\r\n\r\n    float offsetx = u_MainTex_TexelSize.x;\r\n    float offsety = u_MainTex_TexelSize.y;\r\n    vec2 offsets[9];\r\n    offsets[0] = vec2(-offsetx,  offsety); // å·¦ä¸Š\r\n    offsets[1] = vec2( 0.0,    offsety); // æ­£ä¸Š\r\n    offsets[2] = vec2( offsetx,  offsety); // å³ä¸Š\r\n    offsets[3] = vec2(-offsetx,  0.0);   // å·¦\r\n    offsets[4] = vec2( 0.0,    0.0);   // ä¸­\r\n    offsets[5] = vec2( offsetx,  0.0);   // å³\r\n    offsets[6] = vec2(-offsetx, -offsety); // å·¦ä¸‹\r\n    offsets[7] = vec2( 0.0,   -offsety); // æ­£ä¸‹\r\n    offsets[8] = vec2( offsetx, -offsety); // å³ä¸‹\r\n\r\n    float Gx[9];\r\n    Gx[0] = -1.0; Gx[1] = 0.0; Gx[2] = 1.0; \r\n    Gx[3] = -2.0; Gx[4] = 0.0; Gx[5] = 2.0; \r\n    Gx[6] = -1.0; Gx[7] = 0.0; Gx[8] = 1.0; \r\n\r\n    float Gy[9];\r\n    Gy[0] = 1.0; Gy[1] = 2.0; Gy[2] = 1.0; \r\n    Gy[3] = 0.0; Gy[4] = 0.0; Gy[5] = 0.0; \r\n    Gy[6] = -1.0; Gy[7] = -2.0;Gy[8] = -1.0; \r\n\r\n    vec3 sampleTex[9];\r\n    float sampleDepth[9];\r\n    vec3 sampleNormal[9];\r\n    for (int i = 0; i < 9; i++)\r\n    {\r\n        vec2 uvOffset = uv + offsets[i];\r\n        sampleTex[i] = texture2D(u_MainTex, uvOffset).rgb;\r\n        sampleDepth[i] = getDepth(uvOffset);\r\n        sampleNormal[i] = (getNormal(uvOffset) + 1.0) / 2.0;\r\n    }\r\n\r\n    vec3 colorGx = vec3(0.0);\r\n    vec3 colorGy = vec3(0.0);\r\n    float depthGx = 0.0;\r\n    float depthGy = 0.0;\r\n    vec3 normalGx = vec3(0.0);\r\n    vec3 normalGy = vec3(0.0);\r\n\r\n    for (int i = 0; i < 9; i++) {\r\n        colorGx += sampleTex[i] * Gx[i];\r\n        colorGy += sampleTex[i] * Gy[i];\r\n        depthGx += sampleDepth[i] * Gx[i];\r\n        depthGy += sampleDepth[i] * Gy[i];\r\n        normalGx += sampleNormal[i] * Gx[i];\r\n        normalGy += sampleNormal[i] * Gy[i];\r\n    }\r\n\r\n    float colDepthG = abs(depthGx) + abs(depthGy);\r\n    depthG = vec3(colDepthG);\r\n\r\n    colorG = abs(colorGx) + abs(colorGy);\r\n\r\n    normalG = abs(normalGx) + abs(normalGy);\r\n\r\n}\r\n\r\nfloat ColorGray(vec3 color) {\r\n    return (color.r + color.g + color.b) / 3.0;\r\n}\r\n\r\nvec3 getEdgeValue(float hold, vec3 valueG) {\r\n    return vec3(step(hold, ColorGray(valueG)));\r\n}\r\n\r\nvoid main() {\r\n    \r\n    vec2 uv = v_Texcoord0;\r\n\r\n    vec3 colorG, normalG, depthG;\r\n    SobelSample(uv, colorG, normalG, depthG);\r\n    vec3 edgeColor = vec3(0.2);\r\n\r\n    #if defined(DEPTHEDGE)\r\n        vec3 edgeValue = getEdgeValue(u_Depthhold, depthG);\r\n    #endif\r\n\r\n    #if defined(NORMALEDGE)\r\n        vec3 edgeValue = getEdgeValue(u_NormalHold, normalG);\r\n    #endif\r\n\r\n    #if defined(COLOREDGE)\r\n        vec3 edgeValue = getEdgeValue(u_ColorHold, colorG);\r\n    #endif\r\n\r\n    vec3 fillColor = u_EdgeColor;\r\n\r\n    #ifdef SOURCE\r\n        fillColor = texture2D(u_MainTex, uv).rgb;\r\n    #endif\r\n\r\n    vec3 finalColor = mix(fillColor, edgeColor, edgeValue);\r\n    gl_FragColor = vec4(finalColor, 1.0);\r\n\r\n}";


export class EdgeEffect extends Laya.PostProcessEffect {
    _shader: any;
    _shaderData: any;
    _depthBufferparam: any;
    _edgeMode: any;
    static _isShaderInit: any;
    static DEPTHTEXTURE: any;
    static DEPTHNORMALTEXTURE: any;
    static DEPTHBUFFERPARAMS: any;
    static EDGECOLOR: any;
    static COLORHOLD: any;
    static DEPTHHOLD: any;
    static NORMALHOLD: any;
    static SHADERDEFINE_SOURCE: any;
    static SHADERDEFINE_COLOREDGE: any;
    static SHADERDEFINE_DEPTHEDGE: any;
    static SHADERDEFINE_NORMALEDGE: any;
    static SHADERDEFINE_DEPTH: any;
    static SHADERDEFINE_DEPTHNORMAL: any;
    constructor() {
        super();
        this._shader = null;
        this._shaderData = new Laya.ShaderData();
        this._depthBufferparam = new Laya.Vector4();
        this._edgeMode = EdgeMode.NormalEdge;
        if (!EdgeEffect._isShaderInit) {
            EdgeEffect._isShaderInit = true;
            EdgeEffect.EdgeEffectShaderInit();
        }
        this._shader = Laya.Shader3D.find("PostProcessEdge");
        this.edgeColor = new Laya.Vector3(0.2, 0.2, 0.2);
        this.colorHold = 0.7;
        this.normalHold = 0.7;
        this.depthHold = 0.7;
        this.edgeMode = EdgeMode.DepthEdge;
        this.showSource = true;
        EdgeEffect._isShaderInit = false;
        EdgeEffect.DEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthTex");
        EdgeEffect.DEPTHNORMALTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthNormalTex");
        EdgeEffect.DEPTHBUFFERPARAMS = Laya.Shader3D.propertyNameToID("u_DepthBufferParams");
        EdgeEffect.EDGECOLOR = Laya.Shader3D.propertyNameToID("u_EdgeColor");
        EdgeEffect.COLORHOLD = Laya.Shader3D.propertyNameToID("u_ColorHold");
        EdgeEffect.DEPTHHOLD = Laya.Shader3D.propertyNameToID("u_Depthhold");
        EdgeEffect.NORMALHOLD = Laya.Shader3D.propertyNameToID("u_NormalHold");
    }
    get edgeColor() {
        return this._shaderData.getVector3(EdgeEffect.EDGECOLOR);
    }
    set edgeColor(value) {
        this._shaderData.setVector3(EdgeEffect.EDGECOLOR, value);
    }
    get colorHold() {
        return this._shaderData.getNumber(EdgeEffect.COLORHOLD);
    }
    set colorHold(value) {
        this._shaderData.setNumber(EdgeEffect.COLORHOLD, value);
    }
    get depthHold() {
        return this._shaderData.getNumber(EdgeEffect.DEPTHHOLD);
    }
    set depthHold(value) {
        this._shaderData.setNumber(EdgeEffect.DEPTHHOLD, value);
    }
    get normalHold() {
        return this._shaderData.getNumber(EdgeEffect.NORMALHOLD);
    }
    set normalHold(value) {
        this._shaderData.setNumber(EdgeEffect.NORMALHOLD, value);
    }
    get edgeMode() {
        return this._edgeMode;
    }
    get showSource() {
        return this._shaderData.hasDefine(EdgeEffect.SHADERDEFINE_SOURCE);
    }
    set showSource(value) {
        if (value) {
            this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_SOURCE);
        }
        else {
            this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_SOURCE);
        }
    }
    set edgeMode(value) {
        this._edgeMode = value;
        switch (value) {
            case EdgeMode.ColorEdge:
                this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
                break;
            case EdgeMode.NormalEdge:
                this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
                break;
            case EdgeMode.DepthEdge:
                this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
                break;
        }
    }
    render(context) {
        let cmd = context.command;
        let viewport = context.camera.viewport;
        let camera = context.camera;
        let far = camera.farPlane;
        let near = camera.nearPlane;
        let source = context.source;
        let destination = context.destination;
        let width = viewport.width;
        let height = viewport.height;
        let renderTexture = Laya.RenderTexture.createFromPool(width, height, Laya.TextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTH_16);
        renderTexture.filterMode = Laya.FilterMode.Bilinear;
        if (camera.depthTextureMode == Laya.DepthTextureMode.Depth) {
            this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTH);
            this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHNORMAL);
            this._shaderData.setTexture(EdgeEffect.DEPTHTEXTURE, camera.depthTexture);
        }
        else if (camera.depthTextureMode == Laya.DepthTextureMode.DepthNormals) {
            this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTHNORMAL);
            this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTH);
            this._shaderData.setTexture(EdgeEffect.DEPTHNORMALTEXTURE, camera.depthNormalTexture);
        }
        this._depthBufferparam.setValue(1.0 - far / near, far / near, (near - far) / (near * far), 1 / near);
        this._shaderData.setVector(EdgeEffect.DEPTHBUFFERPARAMS, this._depthBufferparam);
        cmd.blitScreenTriangle(source, renderTexture, null, this._shader, this._shaderData, 0);
        context.source = renderTexture;
        context.deferredReleaseTextures.push(renderTexture);
    }
    static EdgeEffectShaderInit() {
        EdgeEffect.SHADERDEFINE_DEPTH = Laya.Shader3D.getDefineByName("DEPTH");
        EdgeEffect.SHADERDEFINE_DEPTHNORMAL = Laya.Shader3D.getDefineByName("DEPTHNORMAL");
        EdgeEffect.SHADERDEFINE_DEPTHEDGE = Laya.Shader3D.getDefineByName("DEPTHEDGE");
        EdgeEffect.SHADERDEFINE_NORMALEDGE = Laya.Shader3D.getDefineByName("NORMALEDGE");
        EdgeEffect.SHADERDEFINE_COLOREDGE = Laya.Shader3D.getDefineByName("COLOREDGE");
        EdgeEffect.SHADERDEFINE_SOURCE = Laya.Shader3D.getDefineByName("SOURCE");
        let attributeMap = {
            'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
        };
        let uniformMap = {
            'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
            'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
            'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DepthTex': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DepthNormalTex': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DepthBufferParams': Laya.Shader3D.PERIOD_MATERIAL,
            'u_ColorHold': Laya.Shader3D.PERIOD_MATERIAL,
            'u_Depthhold': Laya.Shader3D.PERIOD_MATERIAL,
            'u_NormalHold': Laya.Shader3D.PERIOD_MATERIAL
        };
        let shader = Laya.Shader3D.add("PostProcessEdge");
        let subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        let pass = subShader.addShaderPass(EdgeEffectVS, EdgeEffectFS);
        pass.renderState.depthWrite = false;
        EdgeEffect._isShaderInit = false;
        EdgeEffect.DEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthTex");
        EdgeEffect.DEPTHNORMALTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthNormalTex");
        EdgeEffect.DEPTHBUFFERPARAMS = Laya.Shader3D.propertyNameToID("u_DepthBufferParams");
        EdgeEffect.EDGECOLOR = Laya.Shader3D.propertyNameToID("u_EdgeColor");
        EdgeEffect.COLORHOLD = Laya.Shader3D.propertyNameToID("u_ColorHold");
        EdgeEffect.DEPTHHOLD = Laya.Shader3D.propertyNameToID("u_Depthhold");
        EdgeEffect.NORMALHOLD = Laya.Shader3D.propertyNameToID("u_NormalHold");
    }
}