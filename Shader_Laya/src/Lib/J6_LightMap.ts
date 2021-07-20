export class J6_LightMap extends Laya.Material {
    static LightMap: any;
    static DiffuseTexture: any;
    constructor() {
        super();
        //设置本材质使用的shader名字
        this.setShaderName("J4_LightMapShader");
        //J6_LightMap.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
    }
    static __init__() {
        J6_LightMap.LightMap = Laya.Shader3D.propertyNameToID("u_LightMap");
        J6_LightMap.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
        //J6_LightMap.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
    }

    get LightMap() { return this._shaderValues.getTexture(J6_LightMap.LightMap); }
    set LightMap(value) { this._shaderValues.setTexture(J6_LightMap.LightMap, value); }

    get DiffuseTexture() { return this._shaderValues.getTexture(J6_LightMap.DiffuseTexture); }
    set DiffuseTexture(value) { this._shaderValues.setTexture(J6_LightMap.DiffuseTexture, value); }

    //get LightmapScaleOffset() {return this._shaderValues.getVector(J6_LightMap.LightmapScaleOffset);}
    //set LightmapScaleOffset(value) {this._shaderValues.setVector(J6_LightMap.LightmapScaleOffset, value);}

    //初始化我们的自定义shader
    static initShader() {

        J6_LightMap.__init__()

        //所有的attributeMap属性
        var attributeMap =
        {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_Texcoord1': Laya.VertexMesh.MESH_TEXTURECOORDINATE1,
        };

        //所有的uniform属性
        var uniformMap =
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,     //相机位置
            'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,

            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,      //环境光
            'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL, //漫反射贴图
            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,   //UV坐标属性
            'u_LightmapScaleOffset': Laya.Shader3D.PERIOD_SPRITE,
            'u_LightMap': Laya.Shader3D.PERIOD_SPRITE,  //光照贴图
        };

        let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;
            attribute vec2 a_Texcoord1;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;
            uniform vec4 u_TilingOffset;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;

            varying vec2 v_LightMapUV;

            void main()
            {
                v_Texcoord0 = a_Texcoord0;

                v_LightMapUV = a_Texcoord1;

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

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
            varying vec2 v_LightMapUV;

            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_DiffuseTexture;
            uniform sampler2D u_LightMap;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 ViewDir = normalize(v_ViewDir);
                vec3 normal = normalize(v_Normal);

                float ln = max (0.0, dot (lightVec,v_Normal));  
                ln = ln*0.5 + 0.5; 
                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);

                vec4 difTex = texture2D(u_DiffuseTexture, v_Texcoord0);
                vec4 LightMap = texture2D(u_DiffuseTexture, v_LightMapUV);

                vec3 diffuse = difTex.rgb * diffuseColor * lightColor * ln;
        
                vec3 specColor = vec3(1.0, 1.0, 1.0);
                float specularIntensity = 0.1;
                float gloss = 0.2;

                //BlinnPhone计算公式
                vec3 h = normalize(ViewDir - lightVec);
                float nh = max (0.0, dot (h,normal));
                vec3 specular = specColor * lightColor * pow (nh, specularIntensity*128.0) * gloss;

                gl_FragColor = vec4(LightMap.rgb, 1.0);

            }`;

        //注册CustomShader 
        var LightSh = Laya.Shader3D.add("J4_LightMapShader");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        LightSh.addSubShader(subShader);

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);
    }
}
