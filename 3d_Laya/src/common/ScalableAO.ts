var BlitScreenVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"Lighting.glsl\";\r\n\r\n#define SHADER_NAME ScalableAO:VS\r\n\r\nattribute vec4 a_PositionTexcoord;\r\nuniform vec4 u_OffsetScale;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform mat4 u_Projection;\r\nuniform mat4 u_View;\r\n\r\nvarying mat4 v_inverseView;\r\nvarying mat4 v_inverseProj;\r\n\r\nvoid main() {\t\r\n\tgl_Position = vec4(u_OffsetScale.x*2.0-1.0+(a_PositionTexcoord.x+1.0)*u_OffsetScale.z,(1.0-((u_OffsetScale.y*2.0-1.0+(-a_PositionTexcoord.y+1.0)*u_OffsetScale.w)+1.0)/2.0)*2.0-1.0, 0.0, 1.0);\t\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n\r\n\tv_inverseView = INVERSE_MAT(u_View);\r\n\tv_inverseProj = INVERSE_MAT(u_Projection);\r\n}";

var FragAO = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME FragAO\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\n// define const\r\n#define SAMPLE_COUNT 6.0\r\n#define TWO_PI 6.28318530718\r\n#define EPSILON 1.0e-4\r\nconst float kBeta = 0.002;\r\nconst float kContrast = 0.6;\r\n// varying\r\nvarying vec2 v_Texcoord0;\r\nvarying mat4 v_inverseProj;\r\n// uniform\r\nuniform sampler2D u_MainTex;\r\nuniform float u_radius;\r\nuniform float u_Intensity;\r\n\r\n\r\nuniform mat4 u_Projection;\r\nuniform vec4 u_ProjectionParams;\r\nuniform mat4 u_ViewProjection;\r\nuniform mat4 u_View;\r\nuniform float u_Time;\r\n\r\n// é‡‡æ · depthNormalTexture, è¿”å›ž positionCS.z, normalVS\r\nfloat GetDepthCSNormalVS(vec2 uv, out vec3 normalVS) {\r\n    vec4 env = texture2D(u_CameraDepthNormalsTexture, uv);\r\n    float depthCS = 0.0;\r\n    DecodeDepthNormal(env, depthCS, normalVS);\r\n    normalVS = normalize(normalVS);\r\n    return depthCS;\r\n}\r\n\r\n// è¿”å›ž è§‚å¯Ÿç©ºé—´æ·±åº¦\r\nfloat GetDepthVS(float depthCS) {\r\n\r\n    return LinearEyeDepth(depthCS, u_ZBufferParams);\r\n    // return depthCS * 20.0;\r\n}\r\n\r\n// æ ¹æ®å±å¹•uvå’Œæ·±åº¦å€¼ï¼Œè®¡ç®— è§‚å¯Ÿç©ºé—´åæ ‡\r\nvec3 GetPositionVS(vec2 uv, float depthCS) {\r\n    vec3 positionNDC = vec3(uv * 2.0 - 1.0, depthCS);\r\n\r\n    vec4 positionVS = v_inverseProj * vec4(positionNDC, 1.0);\r\n    return positionVS.xyz / positionVS.w;\r\n}\r\n\r\nfloat UVRandom(float u, float v) {\r\n    float f = dot(vec2(12.9898, 78.233), vec2(u, v));\r\n    return fract(43758.5453 * sin(f));\r\n}\r\n\r\n// èŽ·å–éšæœºåç§»\r\nvec3 PickSamplePoint(vec2 uv, int i) {\r\n    float index = float(i);\r\n\r\n    float time =sin(u_Time*2.0);\r\n    // todo  é‡‡æ · noise ä»£æ›¿è®¡ç®—éšæœº?\r\n    float u = UVRandom(uv.x + time, uv.y + index) * 2.0 - 1.0;\r\n    float theta = UVRandom(-uv.x - time, uv.y + index) * TWO_PI;\r\n\r\n    vec3 v = vec3(vec2(cos(theta), sin(theta)) * sqrt(1.0 - u * u), u);\r\n    float l = sqrt((index + 1.0) / SAMPLE_COUNT) * u_radius;\r\n    return v * l;\r\n}\r\n\r\nvec4 PackAONormal(float ao, vec3 normal) {\r\n    return vec4(ao, normal * 0.5 + 0.5);\r\n}\r\n\r\nvoid main() {\r\n    vec2 uv = v_Texcoord0;\r\n    //æ³•çº¿\r\n    vec3 normalVS = vec3(0.0);\r\n    float depthCS = GetDepthCSNormalVS(uv, normalVS);\r\n    //éžçº¿æ€§æ·±åº¦\r\n    depthCS = SAMPLE_DEPTH_TEXTURE(u_CameraDepthTexture, uv);\r\n    //çº¿æ€§æ·±åº¦\r\n    float depthVS = GetDepthVS(depthCS);\r\n    //èŽ·å¾—è§‚å¯Ÿç©ºé—´çš„ä½ç½®\r\n    vec3 positionVS = GetPositionVS(uv, depthCS);\r\n\r\n    float ao = 0.0;\r\n    vec3 tempNormalVS;\r\n    \r\n    for (int s = 0; s < int(SAMPLE_COUNT); s++) {\r\n        // éšæœºåç§»\r\n        vec3 sampleOffset = PickSamplePoint(uv, s);\r\n        // è°ƒæ•´åç§»æ–¹å‘ï¼Œ ä¸Ž normalVS åŒå‘,ä¿è¯åŠçƒ\r\n        sampleOffset = -sampleOffset * sign(dot(-normalVS , sampleOffset));\r\n        sampleOffset = sampleOffset*0.5;\r\n\r\n        vec3 positionVS_S = sampleOffset + positionVS;\r\n\r\n        // å°†åç§»åŽview space åæ ‡ ä¹˜ä¸ŠæŠ•å½±çŸ©é˜µè½¬æ¢åˆ° clip space\r\n        vec3 positionCS_S = (u_Projection * vec4(positionVS_S, 1.0)).xyz;\r\n        // èŽ·å– åç§»ç‚¹ çš„å±å¹• uv\r\n        vec2 uv_S = (positionCS_S.xy / (-positionVS_S.z) + 1.0) * 0.5;\r\n        // é‡‡æ · uv_S èŽ·å– æ·±åº¦å€¼\r\n        //å–å¾—æ·±åº¦\r\n        float depthCS_S = SAMPLE_DEPTH_TEXTURE(u_CameraDepthTexture, uv_S);\r\n        if (uv_S.x < 0.0 || uv_S.y > 1.0) {\r\n            depthCS_S += 1.0e8;\r\n        }\r\n        //å¾—åˆ°é‡‡æ ·ç‚¹çš„ä¸–ç•Œåæ ‡\r\n        vec3 positionVS_S2 = GetPositionVS(uv_S, depthCS_S);\r\n        vec3 sampleOffset2 = positionVS_S2 - positionVS;\r\n        float a1 = max(dot(sampleOffset2, normalVS) - kBeta * depthVS, 0.0);\r\n        float a2 = dot(sampleOffset2, sampleOffset2) + EPSILON;\r\n        ao += a1/ a2;\r\n    }\r\n\r\n    ao *= u_radius;\r\n\r\n    ao = pow(abs(ao * u_Intensity / SAMPLE_COUNT), kContrast);\r\n\r\n     gl_FragColor = PackAONormal(ao, normalVS);\r\n}";

var AoBlurHorizontal = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME AOBlurHorizontal\r\n//è´¨é‡\r\n#define BLUR_HIGH_QUALITY 0\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform vec2 u_Delty;\r\n\r\nvec3 GetPackedNormal(vec4 p)\r\n{\r\n    return p.gba * 2.0 - 1.0;\r\n}\r\n\r\nfloat CompareNormal(vec3 d1, vec3 d2)\r\n{\r\n    return smoothstep(0.8, 1.0, dot(d1, d2));\r\n}\r\n\r\nfloat GetPackedAO(vec4 p)\r\n{\r\n    return p.r;\r\n}\r\n\r\nvec4 PackAONormal(float ao, vec3 normal) {\r\n    return vec4(ao, normal * 0.5 + 0.5);\r\n}\r\n\r\nvoid main() {\r\n\t vec2 delta = vec2(u_MainTex_TexelSize.x * 2.0*u_Delty.x,u_Delty.y*u_MainTex_TexelSize.y*2.0);\r\n\t vec2 uv = v_Texcoord0;\r\n\r\n\r\n#if defined(BLUR_HIGH_QUALITY)\r\n\r\n    // High quality 7-tap Gaussian with adaptive sampling\r\n\tvec2 uvtran = uv;\r\n    vec4 p0  = texture2D(u_MainTex,uv);\r\n\tuvtran = uv-delta;\r\n    vec4 p1a = texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv+delta;\r\n    vec4 p1b = texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv-delta*2.0;\r\n    vec4 p2a =  texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv+delta*2.0;\r\n    vec4 p2b =  texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv-delta * 3.2307692308;\r\n    vec4 p3a =  texture2D(u_MainTex,uvtran);;\r\n\tuvtran = uv+delta * 3.2307692308;\r\n    vec4 p3b =  texture2D(u_MainTex,uvtran);;\r\n\r\n    vec3 n0 = GetPackedNormal(p0);\r\n    \r\n\r\n    float w0  = 0.37004405286;\r\n    float w1a = CompareNormal(n0, GetPackedNormal(p1a)) * 0.31718061674;\r\n    float w1b = CompareNormal(n0, GetPackedNormal(p1b)) * 0.31718061674;\r\n    float w2a = CompareNormal(n0, GetPackedNormal(p2a)) * 0.19823788546;\r\n    float w2b = CompareNormal(n0, GetPackedNormal(p2b)) * 0.19823788546;\r\n    float w3a = CompareNormal(n0, GetPackedNormal(p3a)) * 0.11453744493;\r\n    float w3b = CompareNormal(n0, GetPackedNormal(p3b)) * 0.11453744493;\r\n\r\n    float s;\r\n    s  = GetPackedAO(p0)  * w0;\r\n    s += GetPackedAO(p1a) * w1a;\r\n    s += GetPackedAO(p1b) * w1b;\r\n    s += GetPackedAO(p2a) * w2a;\r\n    s += GetPackedAO(p2b) * w2b;\r\n    s += GetPackedAO(p3a) * w3a;\r\n    s += GetPackedAO(p3b) * w3b;\r\n\r\n    s /= w0 + w1a + w1b + w2a + w2b + w3a + w3b;\r\n\r\n#else\r\n\r\n    // Fater 5-tap Gaussian with linear sampling\r\n    vec4 p0  = texture2D(u_MainTex, sampler_MainTex, i.texcoordStereo);\r\n    vec4 p1a = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, UnityStereoTransformScreenSpaceTex(i.texcoord - delta * 1.3846153846));\r\n    vec4 p1b = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, UnityStereoTransformScreenSpaceTex(i.texcoord + delta * 1.3846153846));\r\n    vec4 p2a = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, UnityStereoTransformScreenSpaceTex(i.texcoord - delta * 3.2307692308));\r\n    vec4 p2b = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, UnityStereoTransformScreenSpaceTex(i.texcoord + delta * 3.2307692308));\r\n\r\n\tvec2 uvtran = uv;\r\n    vec4 p0  = texture2D(u_MainTex,uv);\r\n\tuvtran = uv-delta * 1.3846153846;\r\n    vec4 p1a = texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv+delta * 1.3846153846;\r\n    vec4 p1b = texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv-delta*3.2307692308;\r\n    vec4 p2a =  texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv+delta*3.2307692308;\r\n    vec4 p2b =  texture2D(u_MainTex,uvtran);\r\n\r\n \tvec3 n0 = GetPackedNormal(p0);\r\n\r\n    float w0  = 0.2270270270;\r\n    float w1a = CompareNormal(n0, GetPackedNormal(p1a)) * 0.3162162162;\r\n    float w1b = CompareNormal(n0, GetPackedNormal(p1b)) * 0.3162162162;\r\n    float w2a = CompareNormal(n0, GetPackedNormal(p2a)) * 0.0702702703;\r\n    float w2b = CompareNormal(n0, GetPackedNormal(p2b)) * 0.0702702703;\r\n\r\n    float s;\r\n    s  = GetPackedAO(p0)  * w0;\r\n    s += GetPackedAO(p1a) * w1a;\r\n    s += GetPackedAO(p1b) * w1b;\r\n    s += GetPackedAO(p2a) * w2a;\r\n    s += GetPackedAO(p2b) * w2b;\r\n\r\n    s /= w0 + w1a + w1b + w2a + w2b;\r\n\r\n#endif\r\n\r\n    gl_FragColor = PackAONormal(s, n0);;\r\n}";

var AOComposition = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME AOBlurHorizontal\r\n//è´¨é‡\r\n#define BLUR_HIGH_QUALITY 0\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nuniform vec3 u_AOColor;\r\nuniform sampler2D u_compositionAoTexture;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvec3 GetPackedNormal(vec4 p)\r\n{\r\n    return p.gba * 2.0 - 1.0;\r\n}\r\nfloat CompareNormal(vec3 d1, vec3 d2)\r\n{\r\n    return smoothstep(0.8, 1.0, dot(d1, d2));\r\n}\r\nfloat GetPackedAO(vec4 p)\r\n{\r\n    return p.r;\r\n}\r\n// Geometry-aware bilateral filter (single pass/small kernel)\r\nfloat BlurSmall(sampler2D tex, vec2 uv, vec2 delta)\r\n{\r\n    vec4 p0 = texture2D(tex,uv);\r\n    vec2 uvtran =uv+vec2(-delta.x,-delta.y) ;\r\n    vec4 p1 = texture2D(tex,uvtran);\r\n    uvtran =uv+vec2(delta.x,-delta.y);\r\n    vec4 p2 = texture2D(tex, uvtran);\r\n    uvtran =uv+vec2(-delta.x,delta.y) ;\r\n    vec4 p3 = texture2D(tex, uvtran);\r\n    uvtran =uv+delta;\r\n    vec4 p4 = texture2D(tex, uvtran);\r\n\r\n    vec3 n0 = GetPackedNormal(p0);\r\n\r\n    float w0 = 1.0;\r\n    float w1 = CompareNormal(n0, GetPackedNormal(p1));\r\n    float w2 = CompareNormal(n0, GetPackedNormal(p2));\r\n    float w3 = CompareNormal(n0, GetPackedNormal(p3));\r\n    float w4 = CompareNormal(n0, GetPackedNormal(p4));\r\n\r\n    float s;\r\n    s  = GetPackedAO(p0) * w0;\r\n    s += GetPackedAO(p1) * w1;\r\n    s += GetPackedAO(p2) * w2;\r\n    s += GetPackedAO(p3) * w3;\r\n    s += GetPackedAO(p4) * w4;\r\n\r\n    return s / (w0 + w1 + w2 + w3 + w4);\r\n}\r\n\r\nvoid main() {\r\n    vec2 uv = v_Texcoord0;\r\n    vec2 delty = u_MainTex_TexelSize.xy;\r\n    float ao = BlurSmall(u_compositionAoTexture,uv,delty);\r\n    vec4 albedo = texture2D(u_MainTex,uv);\r\n    vec4 aocolor = vec4(ao*u_AOColor,ao);\r\n    //albedo.rgb = ao*u_AOColor*albedo.rgb;\r\n    albedo.rgb = albedo.rgb*(1.0-ao)+ao*u_AOColor*ao;\r\n    gl_FragColor = albedo;\r\n\r\n\r\n}";

export class ScalableAO extends Laya.PostProcessEffect {
    _shader: any;
    _shaderData: any;
    _aoBlurHorizontalShader: any;
    _aoComposition: any;
    static BlurDelty: any;
    static AOColor: any;
    static instance: any;
    static radius: any;
    static HasInit: any;
    static VIEWPROJECTMATRIX: any;
    static deltyHorizontal: any;
    static deltyVector: any;
    static aoTexture: any;
    constructor() {
        super();
        ScalableAO.HasInit || ScalableAO.init();
        this._shader = Laya.Shader3D.find("ScalableAO");
        this._shaderData = new Laya.ShaderData();
        //this._shaderData.setVector(Laya.BaseCamera.DEPTHZBUFFERPARAMS, new Laya.Vector4());
        this._aoBlurHorizontalShader = Laya.Shader3D.find("AOBlurHorizontal");
        this._aoComposition = Laya.Shader3D.find("AOComposition");
        ScalableAO.BlurDelty = Laya.Shader3D.propertyNameToID("u_Delty");
        ScalableAO.AOColor = Laya.Shader3D.propertyNameToID("u_AOColor");
        ScalableAO.aoTexture = Laya.Shader3D.propertyNameToID("u_compositionAoTexture");
        ScalableAO.radius = Laya.Shader3D.propertyNameToID("u_radius");
        ScalableAO.instance = Laya.Shader3D.propertyNameToID("u_Intensity");
        ScalableAO.HasInit = false;
        ScalableAO.deltyHorizontal = new Laya.Vector2(1.0, 0.0);
        ScalableAO.deltyVector = new Laya.Vector2(0.0, 1.0);
    }
    static init() {
        let attributeMap = {
            'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
        };
        let uniformMap = {
            'u_Projection': Laya.Shader3D.PERIOD_MATERIAL,
            'u_ProjectionParams': Laya.Shader3D.PERIOD_MATERIAL,
            'u_ViewProjection': Laya.Shader3D.PERIOD_MATERIAL,
            'u_ZBufferParams': Laya.Shader3D.PERIOD_MATERIAL,
            'u_View': Laya.Shader3D.PERIOD_MATERIAL,
            'u_Time': Laya.Shader3D.PERIOD_MATERIAL,
            'u_CameraDepthTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_CameraDepthNormalsTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_radius': Laya.Shader3D.PERIOD_MATERIAL,
            'u_Intensity': Laya.Shader3D.PERIOD_MATERIAL,
            'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
            'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
        };
        let shader = Laya.Shader3D.add("ScalableAO");
        let subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(BlitScreenVS, FragAO);
        attributeMap = {
            'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
        };
        shader = Laya.Shader3D.add("AOBlurHorizontal");
        subShader = new Laya.SubShader(attributeMap, {
            'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
            'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
            'u_View': Laya.Shader3D.PERIOD_MATERIAL,
            'u_Projection': Laya.Shader3D.PERIOD_MATERIAL
            //'u_Delty': Laya.Shader3D.PERIOD_MATERIAL,
            //'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL
        });
        shader.addSubShader(subShader);
        subShader.addShaderPass(BlitScreenVS, AoBlurHorizontal);
        attributeMap = {
            'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
        };
        shader = Laya.Shader3D.add("AOComposition");
        subShader = new Laya.SubShader(attributeMap, {
            'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
            'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
            'u_View': Laya.Shader3D.PERIOD_MATERIAL,
            'u_Projection': Laya.Shader3D.PERIOD_MATERIAL
            //'u_Delty': Laya.Shader3D.PERIOD_MATERIAL,
            //'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
            //'u_AOColor': Laya.Shader3D.PERIOD_MATERIAL,
            //'u_compositionAoTexture': Laya.Shader3D.PERIOD_MATERIAL
        });
        shader.addSubShader(subShader);
        subShader.addShaderPass(BlitScreenVS, AOComposition);
        ScalableAO.BlurDelty = Laya.Shader3D.propertyNameToID("u_Delty");
        ScalableAO.AOColor = Laya.Shader3D.propertyNameToID("u_AOColor");
        ScalableAO.aoTexture = Laya.Shader3D.propertyNameToID("u_compositionAoTexture");
        ScalableAO.radius = Laya.Shader3D.propertyNameToID("u_radius");
        ScalableAO.instance = Laya.Shader3D.propertyNameToID("u_Intensity");
        ScalableAO.HasInit = false;
        ScalableAO.deltyHorizontal = new Laya.Vector2(1.0, 0.0);
        ScalableAO.deltyVector = new Laya.Vector2(0.0, 1.0);
    }
    set aoColor(value) {
        this._shaderData.setVector3(ScalableAO.AOColor, value);
    }
    set instance(value) {
        this._shaderData.setNumber(ScalableAO.instance, value);
    }
    set radius(value) {
        this._shaderData.setNumber(ScalableAO.radius, value);
    }
    setUniform(camera) {
        let scene = camera.scene;
        let shaderData = this._shaderData;
        // shaderData.setMatrix4x4(Laya.BaseCamera.VIEWPROJECTMATRIX, camera._shaderValues.getMatrix4x4(Laya.BaseCamera.VIEWPROJECTMATRIX));
        // shaderData.setMatrix4x4(Laya.BaseCamera.PROJECTMATRIX, camera._shaderValues.getMatrix4x4(Laya.BaseCamera.PROJECTMATRIX));
        // shaderData.setVector(Laya.BaseCamera.DEPTHZBUFFERPARAMS, camera._shaderValues.getVector(Laya.BaseCamera.DEPTHZBUFFERPARAMS));
        // shaderData.setVector(Laya.BaseCamera.PROJECTION_PARAMS, camera._shaderValues.getVector(Laya.BaseCamera.PROJECTION_PARAMS));
        // shaderData.setMatrix4x4(Laya.BaseCamera.VIEWMATRIX, camera._shaderValues.getMatrix4x4(Laya.BaseCamera.VIEWMATRIX));
        // shaderData.setTexture(Laya.DepthPass.DEPTHNORMALSTEXTURE, camera._shaderValues.getTexture(Laya.DepthPass.DEPTHNORMALSTEXTURE));
        // shaderData.setTexture(Laya.DepthPass.DEPTHTEXTURE, camera._shaderValues.getTexture(Laya.DepthPass.DEPTHTEXTURE));
        shaderData.setVector2(ScalableAO.BlurDelty, ScalableAO.deltyHorizontal);
        //shaderData.setNumber(Laya.Scene3D.TIME, scene._shaderValues.getNumber(Laya.Scene3D.TIME));
    }
    render(context) {
        let cmd = context.command;
        let viewport = context.camera.viewport;
        let camera = context.camera;
        camera.depthTextureMode |= Laya.DepthTextureMode.DepthNormals;
        camera.depthTextureMode |= Laya.DepthTextureMode.Depth;
        let depthNormalTexture = camera.depthNormalTexture;
        let depthTexture = camera.depthTexture;
        if (!depthNormalTexture || !depthTexture) {
            return;
        }
        depthNormalTexture.wrapModeU = Laya.WarpMode.Clamp;
        depthNormalTexture.wrapModeV = Laya.WarpMode.Clamp;
        let source = context.source;
        let width = source.width;
        let height = source.height;
        let textureFormat = source.format;
        let depthFormat = Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE;
        let finalTex = Laya.RenderTexture.createFromPool(width, height, textureFormat, depthFormat);
        let shader = this._shader;
        let shaderData = this._shaderData;
        this.setUniform(camera);
        cmd.blitScreenTriangle(null, finalTex, null, shader, shaderData, 0);
        let blurTex = Laya.RenderTexture.createFromPool(width, height, textureFormat, depthFormat);
        cmd.blitScreenTriangle(finalTex, blurTex, null, this._aoBlurHorizontalShader, shaderData, 0);
        cmd.setShaderDataVector2(shaderData, ScalableAO.BlurDelty, ScalableAO.deltyVector);
        cmd.blitScreenTriangle(blurTex, finalTex, null, this._aoBlurHorizontalShader, this._shaderData, 0);
        cmd.setShaderDataTexture(shaderData, ScalableAO.aoTexture, finalTex);
        cmd.blitScreenTriangle(null, blurTex, null, this._aoComposition, this._shaderData, 0);
        context.source = blurTex;
        context.deferredReleaseTextures.push(finalTex);
        context.deferredReleaseTextures.push(blurTex);
    }
}