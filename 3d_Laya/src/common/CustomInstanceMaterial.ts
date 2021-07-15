var CustomInstanceVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n#include \"Lighting.glsl\";\r\n#include \"LayaUtile.glsl\";\r\n\r\nattribute vec4 a_Position;\r\n\r\n#ifdef GPU_INSTANCE\r\n\tuniform mat4 u_ViewProjection;\r\n\tattribute mat4 a_WorldMat;\r\n#else\r\n\tuniform mat4 u_MvpMatrix;\r\n#endif\r\n\r\n#ifdef GPU_INSTANCE\r\n    attribute vec4 a_InstanceColor;\r\n#endif\r\n\r\nvarying vec4 v_Color;\r\n\r\nvoid main() {\r\n\tvec4 position;\r\n\tposition=a_Position;\r\n\t#ifdef GPU_INSTANCE\r\n\t\tgl_Position = u_ViewProjection * a_WorldMat * position;\r\n\t#else\r\n\t\tgl_Position = u_MvpMatrix * position;\r\n\t#endif\r\n\r\n\r\n    #ifdef GPU_INSTANCE\r\n\t\tv_Color =a_InstanceColor;\r\n\t#else\r\n\t\tv_Color = vec4(1.0,1.0,1.0,1.0);\r\n\t#endif\r\n\r\n\tgl_Position=remapGLPositionZ(gl_Position);\r\n}";

var CustomInstanceFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec4 v_Color;\r\n\r\nvoid main()\r\n{\r\n\tvec4 color =  v_Color;\r\n\tgl_FragColor.rgb = color.rgb;\r\n\t\r\n}\r\n\r\n";

export class CustomInstanceMaterial extends Laya.Material {
    static init() {
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
            'a_WorldMat': Laya.VertexMesh.MESH_WORLDMATRIX_ROW0,
            'a_InstanceColor': Laya.VertexMesh.MESH_CUSTOME0
        };
        var uniformMap = {
            'u_ViewProjection': Laya.Shader3D.PERIOD_CAMERA,
            'u_MvpMatrix': Laya.Shader3D.PERIOD_CAMERA
        };
        var stateMap = {
            's_Cull': Laya.Shader3D.RENDER_STATE_CULL,
            's_Blend': Laya.Shader3D.RENDER_STATE_BLEND,
            's_BlendSrc': Laya.Shader3D.RENDER_STATE_BLEND_SRC,
            's_BlendDst': Laya.Shader3D.RENDER_STATE_BLEND_DST,
            's_DepthTest': Laya.Shader3D.RENDER_STATE_DEPTH_TEST,
            's_DepthWrite': Laya.Shader3D.RENDER_STATE_DEPTH_WRITE
        };
        var shader = Laya.Shader3D.add("CustomInstanceMat", null, null, false);
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        subShader.addShaderPass(CustomInstanceVS, CustomInstanceFS, stateMap, "Forward");
    }
    constructor() {
        super();
        this.setShaderName("CustomInstanceMat");
        this.renderModeSet();
    }
    renderModeSet() {
        this.alphaTest = true;
        this.renderQueue = Laya.Material.RENDERQUEUE_OPAQUE;
        this.depthWrite = true;
        this.cull = Laya.RenderState.CULL_BACK;
        this.blend = Laya.RenderState.BLEND_DISABLE;
        this.depthTest = Laya.RenderState.DEPTHTEST_LESS;
    }
}
