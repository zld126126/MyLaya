var DepthNormalVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvoid main() {\r\n    vec4 position;\r\n    position=a_Position;\r\n    v_Texcoord0=a_Texcoord0;\r\n    gl_Position = u_MvpMatrix * position;\r\n    gl_Position=remapGLPositionZ(gl_Position);\r\n}";

var DepthNormalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main(){\r\n    vec2 uv = vec2(v_Texcoord0.x,1.0-v_Texcoord0.y);\r\n    vec4 col = texture2D(u_CameraDepthNormalsTexture,uv);\r\n    vec3 normals;\r\n    float depth;\r\n    DecodeDepthNormal(col,depth,normals);\r\n    col = vec4(normals,1.0);\r\n    gl_FragColor = col;\r\n}";

export class DepthNormalsMaterial extends Laya.Material {
    static init() {
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0
        };
        var uniformMap = {
            'u_CameraDepthNormalsTexture': Laya.Shader3D.PERIOD_CAMERA,
            'u_CameraDepthTexture': Laya.Shader3D.PERIOD_CAMERA,
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE
        };
        var stateMap = {
            's_Cull': Laya.Shader3D.RENDER_STATE_CULL,
            's_Blend': Laya.Shader3D.RENDER_STATE_BLEND,
            's_BlendSrc': Laya.Shader3D.RENDER_STATE_BLEND_SRC,
            's_BlendDst': Laya.Shader3D.RENDER_STATE_BLEND_DST,
            's_DepthTest': Laya.Shader3D.RENDER_STATE_DEPTH_TEST,
            's_DepthWrite': Laya.Shader3D.RENDER_STATE_DEPTH_WRITE
        };
        var shader = Laya.Shader3D.add("DepthNormalShader", null, null, false, false);
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(DepthNormalVS, DepthNormalFS, stateMap, "Forward");
    }
    
    constructor() {
        super();
        this.setShaderName("DepthNormalShader");
        this.renderModeSet();
    }

    renderModeSet() {
        this.alphaTest = false;
        this.renderQueue = Laya.Material.RENDERQUEUE_OPAQUE;
        this.depthWrite = true;
        this.cull = Laya.RenderState.CULL_BACK;
        this.blend = Laya.RenderState.BLEND_DISABLE;
        this.depthTest = Laya.RenderState.DEPTHTEST_LESS;
    }
}