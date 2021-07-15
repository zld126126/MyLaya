var GlassShaderVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_Position;\r\n\r\nattribute vec2 a_Texcoord0;\r\nuniform mat4 u_MvpMatrix;\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform vec4 u_TilingOffset;\r\nvarying vec2 v_ScreenTexcoord;\r\n\r\nvoid main() {\r\n\tvec4 position;\r\n\tposition=a_Position;\r\n\tgl_Position = u_MvpMatrix * position;\r\n\tv_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);\r\n\tgl_Position=remapGLPositionZ(gl_Position);\r\n\tv_ScreenTexcoord =vec2((gl_Position.x/gl_Position.w+1.0)*0.5, (gl_Position.y/gl_Position.w+1.0)*0.5);\r\n}";

var GlassShaderFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nuniform sampler2D u_tintTexure;\r\nuniform sampler2D u_screenTexture;\r\nvarying vec2 v_Texcoord0;\r\nuniform float u_tintAmount;\r\nvarying vec2 v_ScreenTexcoord;\r\n\r\nvoid main()\r\n{\r\n\tvec4 color;\r\n\tcolor =mix(texture2D(u_screenTexture,v_ScreenTexcoord),texture2D(u_tintTexure, v_Texcoord0),0.5);\r\n\r\n\tgl_FragColor = color;\r\n}\r\n\r\n";

export class GlassWithoutGrabMaterail extends Laya.Material {
    static TILINGOFFSET: any;
    static TINTTEXTURE: any;
    static DEPTH_WRITE: any;
    static CULL: any;
    static BLEND: any;
    static BLEND_SRC: any;
    static BLEND_DST: any;
    static DEPTH_TEST: any;
    static NORMALTEXTURE: any;
    static ALBEDOCOLOR: any;

    constructor(texture) {
        super();
        this.setShaderName("GlassShader");
        this.renderModeSet();
        this._shaderValues.setVector(GlassWithoutGrabMaterail.TILINGOFFSET, new Laya.Vector4(1, 1, 0, 0));
        this._shaderValues.setTexture(GlassWithoutGrabMaterail.TINTTEXTURE, texture);
        GlassWithoutGrabMaterail.CULL = Laya.Shader3D.propertyNameToID("s_Cull");
        GlassWithoutGrabMaterail.BLEND = Laya.Shader3D.propertyNameToID("s_Blend");
        GlassWithoutGrabMaterail.BLEND_SRC = Laya.Shader3D.propertyNameToID("s_BlendSrc");
        GlassWithoutGrabMaterail.BLEND_DST = Laya.Shader3D.propertyNameToID("s_BlendDst");
        GlassWithoutGrabMaterail.DEPTH_TEST = Laya.Shader3D.propertyNameToID("s_DepthTest");
        GlassWithoutGrabMaterail.DEPTH_WRITE = Laya.Shader3D.propertyNameToID("s_DepthWrite");
        GlassWithoutGrabMaterail.TINTTEXTURE = Laya.Shader3D.propertyNameToID("u_tintTexure");
        GlassWithoutGrabMaterail.NORMALTEXTURE = Laya.Shader3D.propertyNameToID("u_normalTexture");
        GlassWithoutGrabMaterail.TILINGOFFSET = Laya.Shader3D.propertyNameToID("u_TilingOffset");
        GlassWithoutGrabMaterail.ALBEDOCOLOR = Laya.Shader3D.propertyNameToID("u_tintAmount");
    }
    static init() {
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
        };
        var uniformMap = {
            'u_tintTexure': Laya.Shader3D.PERIOD_MATERIAL,
            'u_normalTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_tintAmount': Laya.Shader3D.PERIOD_MATERIAL,
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
        var shader = Laya.Shader3D.add("GlassShader", null, null, false);
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(GlassShaderVS, GlassShaderFS, stateMap, "Forward");
    }
    get depthWrite() {
        return this._shaderValues.getBool(GlassWithoutGrabMaterail.DEPTH_WRITE);
    }
    set depthWrite(value) {
        this._shaderValues.setBool(GlassWithoutGrabMaterail.DEPTH_WRITE, value);
    }
    get cull() {
        return this._shaderValues.getInt(GlassWithoutGrabMaterail.CULL);
    }
    set cull(value) {
        this._shaderValues.setInt(GlassWithoutGrabMaterail.CULL, value);
    }
    get blend() {
        return this._shaderValues.getInt(GlassWithoutGrabMaterail.BLEND);
    }
    set blend(value) {
        this._shaderValues.setInt(GlassWithoutGrabMaterail.BLEND, value);
    }
    get blendSrc() {
        return this._shaderValues.getInt(GlassWithoutGrabMaterail.BLEND_SRC);
    }
    set blendSrc(value) {
        this._shaderValues.setInt(GlassWithoutGrabMaterail.BLEND_SRC, value);
    }
    get blendDst() {
        return this._shaderValues.getInt(GlassWithoutGrabMaterail.BLEND_DST);
    }
    set blendDst(value) {
        this._shaderValues.setInt(GlassWithoutGrabMaterail.BLEND_DST, value);
    }
    get depthTest() {
        return this._shaderValues.getInt(GlassWithoutGrabMaterail.DEPTH_TEST);
    }
    set depthTest(value) {
        this._shaderValues.setInt(GlassWithoutGrabMaterail.DEPTH_TEST, value);
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
