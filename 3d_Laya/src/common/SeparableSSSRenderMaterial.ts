var SSSSRenderVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform vec4 u_TilingOffset;\r\nvarying vec2 v_ScreenTexcoord;\r\n\r\nvoid main() {\r\n\tvec4 position;\r\n\tposition=a_Position;\r\n\tgl_Position = u_MvpMatrix * position;\r\n\tv_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);\r\n\tgl_Position=remapGLPositionZ(gl_Position);\r\n\tv_ScreenTexcoord =vec2((gl_Position.x/gl_Position.w+1.0)*0.5, (gl_Position.y/gl_Position.w+1.0)*0.5);\r\n}";

var SSSSRenderFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nuniform sampler2D sssssDiffuseTexture;\r\nuniform sampler2D sssssSpecularTexture;\r\nvarying vec2 v_Texcoord0;\r\nvarying vec2 v_ScreenTexcoord;\r\n\r\nvoid main()\r\n{\r\n\tvec4 color;\r\n\tcolor =texture2D(sssssDiffuseTexture,v_ScreenTexcoord)+texture2D(sssssSpecularTexture, v_ScreenTexcoord);\r\n\r\n\tgl_FragColor = color;\r\n}\r\n\r\n";

export class SeparableSSSRenderMaterial extends Laya.Material {
    static TILINGOFFSET: any;
    static SSSSDIFUSETEX: any;
    static SSSSSPECULARTEX: any;

    constructor() {
        super();
        this.setShaderName("SeparableRender");
        this.renderModeSet();
        this._shaderValues.setVector(SeparableSSSRenderMaterial.TILINGOFFSET, new Laya.Vector4(1, 1, 0, 0));
        SeparableSSSRenderMaterial.SSSSDIFUSETEX = Laya.Shader3D.propertyNameToID("sssssDiffuseTexture");
        SeparableSSSRenderMaterial.SSSSSPECULARTEX = Laya.Shader3D.propertyNameToID("sssssSpecularTexture");
        SeparableSSSRenderMaterial.TILINGOFFSET = Laya.Shader3D.propertyNameToID("u_TilingOffset");
    }

    static init() {
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
        };
        var uniformMap = {
            'sssssDiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'sssssSpecularTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
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
        var shader = Laya.Shader3D.add("SeparableRender", null, null, false);
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(SSSSRenderVS, SSSSRenderFS, stateMap, "Forward");
    }
    renderModeSet() {
        this.alphaTest = false;
        this.renderQueue = Laya.Material.RENDERQUEUE_TRANSPARENT;
        this.depthWrite = true;
        this.cull = Laya.RenderState.CULL_BACK;
        this.blend = Laya.RenderState.BLEND_DISABLE;
        this.depthTest = Laya.RenderState.DEPTHTEST_LESS;
    }
}