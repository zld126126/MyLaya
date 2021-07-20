export class J8_MatCap extends Laya.Material {

    static MatCapTexture : any;
    static TilingOffset : any;

    get MatCapTexture() {return this._shaderValues.getTexture(J8_MatCap.MatCapTexture);}
    set MatCapTexture(value) {this._shaderValues.setTexture(J8_MatCap.MatCapTexture, value);}

    get TilingOffset() {return this._shaderValues.getVector(J8_MatCap.TilingOffset);}
    set TilingOffset(value) {this._shaderValues.setVector(J8_MatCap.TilingOffset, value);}

    constructor() 
    { 
        super(); 
        //设置本材质使用的shader名字
        this.setShaderName("J8_MatCapShader");
        this.TilingOffset = new Laya.Vector4(3.0, 3.0, 0.0, 0.0);
    }

    static __init__(){
        J8_MatCap.MatCapTexture = Laya.Shader3D.propertyNameToID("u_MatCapTexture");
        J8_MatCap.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
    }

    //初始化我们的自定义shader
    static initShader() {

        J8_MatCap.__init__();

        //所有的attributeMap属性
        var attributeMap = 
        {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
        };

        //所有的uniform属性
        var uniformMap = 
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,     //相机位置
            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,      //环境光
            'u_MatCapTexture': Laya.Shader3D.PERIOD_MATERIAL, //MatCap贴图
            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,   //UV坐标属性
        };

        //注册CustomShader 
        var LightSh = Laya.Shader3D.add("J8_MatCapShader");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        LightSh.addSubShader(subShader);

        let VS = `
        #include "Lighting.glsl";

        attribute vec4 a_Position;
        attribute vec3 a_Normal;
        attribute vec2 a_Texcoord0;

        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        uniform vec3 u_CameraPos;
        uniform vec4 u_TilingOffset;

        varying vec3 v_Normal;
        varying vec3 v_ViewDir;
        varying vec2 v_Texcoord0;
        varying mat3 ModelViewMatrix;

        void main()
        {
            v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

            mat3 worldMat = mat3(u_WorldMat);
            v_Normal = worldMat * a_Normal;

            vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
            v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

            ModelViewMatrix = inverse(mat3(u_MvpMatrix)); //逆转置矩阵

            gl_Position = u_MvpMatrix * a_Position;

        } `;

        let FS = `

        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        
        #include "Lighting.glsl";

        varying vec3 v_Normal;
        varying vec3 v_ViewDir;
        varying vec2 v_Texcoord0;
        varying mat3 ModelViewMatrix;

        uniform vec3 u_AmbientColor;   //环境光

        uniform sampler2D u_MatCapTexture;

        void main()
        {   
            vec3 ViewDir = normalize(v_ViewDir);
            vec3 normal = normalize(v_Normal);

            vec3 ViewNormal = vec3( dot(normal, normalize(ModelViewMatrix[0])), dot(normal, normalize(ModelViewMatrix[1])), 1.0);
            //vec2 matCapUV = ViewNormal.xy*0.5+0.5;  //从[-1,1]映射到[0,1]

            vec3 r = reflect(ViewDir, ViewNormal);
            float m = 2.0 * sqrt(r.x * r.x + r.y * r.y + (r.z + 1.0) * (r.z + 1.0));
            vec2 matCapUV = r.xy/m + 0.5;

            vec3 MatCapDiffuse = texture2D(u_MatCapTexture, matCapUV).rgb;

            vec4 difTex = texture2D(u_MatCapTexture, v_Texcoord0);

            gl_FragColor = vec4(MatCapDiffuse.rgb, 1.0);

        }`;

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);

    }
}


