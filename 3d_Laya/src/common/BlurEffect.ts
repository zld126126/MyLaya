var BlurVS = "#include \"Lighting.glsl\";\r\n#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\nattribute vec4 a_PositionTexcoord;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}";

var BlurHorizentalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nuniform float u_DownSampleValue;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    vec2 uv = v_Texcoord0;\r\n    vec2 uvOffset = vec2(1.0,0.0)*u_MainTex_TexelSize.xy*u_DownSampleValue;\r\n    uv = uv - uvOffset*3.0;\r\n    //é«˜æ–¯å‚æ•°\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.324*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n\r\n    gl_FragColor = color;\r\n    \r\n\r\n    \r\n}";

var BlurVerticalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nuniform float u_DownSampleValue;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    vec2 uv = v_Texcoord0;\r\n    vec2 uvOffset = vec2(0.0,1.0)*u_MainTex_TexelSize.xy*u_DownSampleValue;\r\n    uv = uv - uvOffset*3.0;\r\n    //é«˜æ–¯å‚æ•°\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.324*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n\r\n    gl_FragColor = color;\r\n    \r\n\r\n    \r\n}";

var BlurDownSampleFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    color += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(1.0,0.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(-1.0,0.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(0.0,-1.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(0.0,1.0));\r\n    gl_FragColor = color/4.0;\r\n    //gl_FragColor = vec4(1.0,0.0,0.0,1.0);\r\n}";

var BlurDownSampleVS = "#include \"Lighting.glsl\";\r\n#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\nattribute vec4 a_PositionTexcoord;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}";

var BlurEdgeAdd = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform sampler2D u_sourceTexture0;\r\n\r\nvoid main()\r\n{\r\n    vec2 uv = v_Texcoord0;\r\n    vec4 mainColor = texture2D(u_MainTex,uv);\r\n    vec4 sourceColor = texture2D(u_sourceTexture0,uv);\r\n    float factor = step(sourceColor.x+sourceColor.y+sourceColor.z,0.001);\r\n    vec4 color = mix(sourceColor,mainColor,factor);\r\n    gl_FragColor =color;\r\n}";

var BlurEdgeSub = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_sourceTexture0;\r\nuniform sampler2D u_sourceTexture1;\r\n\r\nvoid main()\r\n{\r\n    vec2 uv = v_Texcoord0;\r\n    vec4 blurColor = texture2D(u_sourceTexture0,uv);\r\n    vec4 clearColor = texture2D(u_sourceTexture1,uv);\r\n    float factor = step(clearColor.x+clearColor.y+clearColor.z,0.001);\r\n    vec4 color = blurColor*factor;\r\n    color = (1.0-step(color.x+color.y+color.z,0.15))*vec4(1.0,0.0,0.0,1.0);\r\n    gl_FragColor = color;\r\n}";


export class BlurEffect extends Laya.PostProcessEffect {
    public static BLUR_TYPE_GaussianBlur: any;
    public static SHADERVALUE_DOWNSAMPLEVALUE: any;
    public static SHADERVALUE_TEXELSIZE: any;
    public static BLUR_TYPE_Simple: any;
    public static SHADERVALUE_MAINTEX: any;
    _shader: any;
    _shaderData: any;
    _downSampleNum: any;
    _blurSpreadSize: any;
    _blurIterations: any;
    _texSize: any;
    _tempRenderTexture: any;

    constructor() {
        super();
        this._shader = null;
        this._shaderData = new Laya.ShaderData();
        this._downSampleNum = 1;
        this._blurSpreadSize = 1;
        this._blurIterations = 2;
        this._texSize = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
        this._shader = Laya.Shader3D.find("blurEffect");
        this._tempRenderTexture = new Array(13);
        BlurEffect.BLUR_TYPE_GaussianBlur = 0;
        BlurEffect.BLUR_TYPE_Simple = 1;
        BlurEffect.SHADERVALUE_MAINTEX = Laya.Shader3D.propertyNameToID("u_MainTex");
        BlurEffect.SHADERVALUE_TEXELSIZE = Laya.Shader3D.propertyNameToID("u_MainTex_TexelSize");
        BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE = Laya.Shader3D.propertyNameToID("u_DownSampleValue");
    }
    static init() {
        BlurEffect.BLUR_TYPE_GaussianBlur = 0;
        BlurEffect.BLUR_TYPE_Simple = 1;
        BlurEffect.SHADERVALUE_MAINTEX = Laya.Shader3D.propertyNameToID("u_MainTex");
        BlurEffect.SHADERVALUE_TEXELSIZE = Laya.Shader3D.propertyNameToID("u_MainTex_TexelSize");
        BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE = Laya.Shader3D.propertyNameToID("u_DownSampleValue");
        var attributeMap = {
            'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
        };
        var uniformMap = {
            'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
            'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DownSampleValue': Laya.Shader3D.PERIOD_MATERIAL,
            'u_sourceTexture0': Laya.Shader3D.PERIOD_MATERIAL,
            'u_sourceTexture1': Laya.Shader3D.PERIOD_MATERIAL
        };
        var shader = Laya.Shader3D.add("blurEffect");
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        var shaderpass = subShader.addShaderPass(BlurDownSampleVS, BlurDownSampleFS);
        var renderState = shaderpass.renderState;
        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
        renderState.depthWrite = false;
        renderState.cull = Laya.RenderState.CULL_NONE;
        renderState.blend = Laya.RenderState.BLEND_DISABLE;
        subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        shaderpass = subShader.addShaderPass(BlurVS, BlurVerticalFS);
        renderState = shaderpass.renderState;
        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
        renderState.depthWrite = false;
        renderState.cull = Laya.RenderState.CULL_NONE;
        renderState.blend = Laya.RenderState.BLEND_DISABLE;
        subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        shaderpass = subShader.addShaderPass(BlurVS, BlurHorizentalFS);
        renderState = shaderpass.renderState;
        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
        renderState.depthWrite = false;
        renderState.cull = Laya.RenderState.CULL_NONE;
        renderState.blend = Laya.RenderState.BLEND_DISABLE;
        subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        shaderpass = subShader.addShaderPass(BlurVS, BlurEdgeSub);
        renderState = shaderpass.renderState;
        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
        renderState.depthWrite = false;
        renderState.cull = Laya.RenderState.CULL_NONE;
        renderState.blend = Laya.RenderState.BLEND_DISABLE;
        subShader = new Laya.SubShader(attributeMap, uniformMap);
        shader.addSubShader(subShader);
        shaderpass = subShader.addShaderPass(BlurVS, BlurEdgeAdd);
        renderState = shaderpass.renderState;
        renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
        renderState.depthWrite = false;
        renderState.cull = Laya.RenderState.CULL_NONE;
        renderState.blend = Laya.RenderState.BLEND_DISABLE;
    }
    get downSampleNum() {
        return this._downSampleNum;
    }
    set downSampleNum(value) {
        this._downSampleNum = Math.min(6, Math.max(value, 0.0));
    }
    get blurSpreadSize() {
        return this._blurSpreadSize;
    }
    set blurSpreadSize(value) {
        this._blurSpreadSize = Math.min(10, Math.max(value, 1.0));
    }
    get blurIterations() {
        return this._blurIterations;
    }
    set blurIterations(value) {
        this._blurIterations = Math.min(Math.max(value, 0.0), 6.0);
    }
    render(context) {
        var cmd = context.command;
        var viewport = context.camera.viewport;
        var scaleFactor = 1.0 / (1 << Math.floor(this._downSampleNum));
        var tw = Math.floor(viewport.width * scaleFactor);
        var th = Math.floor(viewport.height * scaleFactor);
        this._texSize.setValue(1.0 / tw, 1.0 / th, tw, th);
        this._shaderData.setNumber(BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE, this.blurSpreadSize);
        this._shaderData.setVector(BlurEffect.SHADERVALUE_TEXELSIZE, this._texSize);
        var downSampleTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        downSampleTexture.filterMode = Laya.FilterMode.Bilinear;
        this._tempRenderTexture[0] = downSampleTexture;
        var lastDownTexture = context.source;
        cmd.blitScreenTriangle(lastDownTexture, downSampleTexture, null, this._shader, this._shaderData, 0);
        lastDownTexture = downSampleTexture;
        for (var i = 0; i < this._blurIterations; i++) {
            var blurTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
            blurTexture.filterMode = Laya.FilterMode.Bilinear;
            cmd.blitScreenTriangle(lastDownTexture, blurTexture, null, this._shader, this._shaderData, 1);
            lastDownTexture = blurTexture;
            this._tempRenderTexture[i * 2 + 1] = blurTexture;
            blurTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
            blurTexture.filterMode = Laya.FilterMode.Bilinear;
            cmd.blitScreenTriangle(lastDownTexture, blurTexture, null, this._shader, this._shaderData, 2);
            lastDownTexture = blurTexture;
            this._tempRenderTexture[i * 2 + 2] = blurTexture;
        }
        context.source = lastDownTexture;
        var maxTexture = this._blurIterations * 2 + 1;
        for (i = 0; i < maxTexture; i++) {
            Laya.RenderTexture.recoverToPool(this._tempRenderTexture[i]);
        }
        context.deferredReleaseTextures.push(lastDownTexture);
    }
}

