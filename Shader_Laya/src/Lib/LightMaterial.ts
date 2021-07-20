// TODO
// export class LightMaterial extends Laya.Material {
//     static DiffuseTexture:any;
    
//     get DiffuseTexture() {
//         return this._shaderValues.getTexture(LightMaterial.DiffuseTexture);
//     }
    
//     set DiffuseTexture(value) {
//         this._shaderValues.setTexture(LightMaterial.DiffuseTexture, value);
//     }

//     //初始化我们的自定义shader
//     static initShader() {

//         //所有的attributeMap属性
//         var attributeMap = 
//         {
//             'a_Position': Laya.VertexMesh.MESH_POSITION0, 
//             'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
//             'a_Color': Laya.VertexMesh.MESH_COLOR0,
//             'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
//             'a_Texcoord1': Laya.VertexMesh.MESH_TEXTURECOORDINATE1,
//             'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0,
//             'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0,
//             'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
//             'a_MvpMatrix': Laya.VertexMesh.MESH_MVPMATRIX_ROW0,
//             'a_WorldMat': Laya.VertexMesh.MESH_WORLDMATRIX_ROW0,
//         };

//         //所有的uniform属性
//         var uniformMap = 
//         {
//             'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
//             'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
//             'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
//             'u_DirectionLight.Direction': Laya.Shader3D.PERIOD_SCENE,
//             'u_DirectionLight.Color': Laya.Shader3D.PERIOD_SCENE,
//             'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
//         };

//         let VS = `

//             #include "Lighting.glsl";

//             attribute vec4 a_Position;
//             attribute vec3 a_Normal;
//             attribute vec2 a_Texcoord0;
//             attribute vec4 a_Tangent0;

//             uniform mat4 u_MvpMatrix;
//             uniform mat4 u_WorldMat;
//             uniform vec3 u_CameraPos;

//             varying vec3 v_Normal;
//             varying vec2 v_Texcoord0;
//             varying vec3 v_Tangent;
//             varying vec3 v_Binormal;
//             varying vec3 v_ViewDir;

//             void main()
//             {
//                 v_Texcoord0 = a_Texcoord0;

//                 mat3 worldMat = mat3(u_WorldMat);

//                 mat3 worldInvMat = inverse(mat3(worldMat));

//                 v_Normal = worldMat * a_Normal;

//                 v_Tangent = a_Tangent0.xyz * worldMat;
//                 v_Binormal = cross(v_Normal,v_Tangent) * a_Tangent0.w;

//                 vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;
//                 v_ViewDir = u_CameraPos - WorldPosition;

//                 gl_Position = u_MvpMatrix * a_Position;

//                 gl_Position = remapGLPositionZ(gl_Position);
//             } `;

//         let FS = `

//             #ifdef FSHIGHPRECISION
//                 precision highp float;
//             #else
//                 precision mediump float;
//             #endif
            
//             #include "Lighting.glsl";

//             varying vec3 v_Normal;
//             varying vec2 v_Texcoord0;
//             varying vec3 v_Tangent;
//             varying vec3 v_Binormal;
//             varying vec3 v_ViewDir;

//             uniform DirectionLight u_DirectionLight;

//             uniform sampler2D u_DiffuseTexture;

//             void main()
//             {   
//                 vec3 lightVec = normalize(u_DirectionLight.Direction);
//                 vec3 lightColor = normalize(u_DirectionLight.Color);
//                 vec3 ViewDir = normalize(v_ViewDir);
//                 vec3 normal = normalize(v_Normal);

//                 vec3 h = normalize(ViewDir - lightVec);
//                 float ln = max (0.0, dot (-lightVec,normal));
//                 float nh = max (0.0, dot (h,normal));

//                 vec4 difTexColor = texture2D(u_DiffuseTexture, v_Texcoord0);

//                 float specColorIntensity = 1.0;
//                 float gloss = 1.0;
//                 vec3 specColor = vec3(1.0,1.0,1.0);

//                 vec3 diffuseColor = lightColor * ln * difTexColor.rgb;
//                 vec3 specularColor = lightColor *specColor*pow (nh, specColorIntensity*128.0) * gloss;

//                 gl_FragColor=vec4(diffuseColor + specularColor, 1.0);
//             }`;

//         //注册CustomShader 
//         var LightSh = Laya.Shader3D.add("LightShader");

//         //创建一个SubShader
//         var subShader = new Laya.SubShader(attributeMap, uniformMap);

//         //我们的自定义shader customShader中添加我们新创建的subShader
//         LightSh.addSubShader(subShader);

//         //往新创建的subShader中添加shaderPass
//         subShader.addShaderPass(VS, FS);
//     }

//     constructor() 
//     { 
    
//         super(); 

//         //设置本材质使用的shader名字
//         this.setShaderName("LightShader");
//     }
// }

// LightMaterial.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
