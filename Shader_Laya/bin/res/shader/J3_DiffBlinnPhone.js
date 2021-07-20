class J3_DiffBlinnPhone extends Laya.Material {

    //初始化我们的自定义shader
    static initShader() {

        //所有的attributeMap属性
        var attributeMap = 
        {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
        };

        //所有的uniform属性
        var uniformMap = 
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,     //相机位置
            'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,

            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,   //环境光
        };

        let VS = `

            attribute vec4 a_Position;
            attribute vec3 a_Normal;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;

            void main()
            {
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

            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 ViewDir = normalize(v_ViewDir);
                vec3 normal = normalize(v_Normal);

                float ln = max (0.0, dot (-lightVec,v_Normal));  
                ln = ln*0.5 + 0.5; 
                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
                vec3 diffuse = diffuseColor * lightColor * ln;

                vec3 specColor = vec3(1.0, 1.0, 1.0);
                float specularIntensity = 0.1;
                float gloss = 0.2;

                //BlinnPhone计算公式
                vec3 h = normalize(ViewDir - lightVec);
                float nh = max (0.0, dot (h,normal));
                vec3 specular = specColor * lightColor * pow (nh, specularIntensity*128.0) * gloss;

                gl_FragColor = vec4(u_AmbientColor + specular + diffuse, 1.0);

            }`;

        //注册CustomShader 
        var LightSh = Laya.Shader3D.add("J3_DiffBlinnPhoneShader");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        LightSh.addSubShader(subShader);

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);
    }

    constructor() 
    { 
    
        super(); 

        //设置本材质使用的shader名字
        this.setShaderName("J3_DiffBlinnPhoneShader");
    }
}

