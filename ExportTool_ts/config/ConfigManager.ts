
export default class ConfigManager{
public static readonly VersionTpl:IMap<IVersionConfig>;

}

/**
	* 由[array]导出的表格基类
	* key:number|string
	* values:[]
	*/
interface IArrayKeyConfig<K,V>{
	readonly key:K;
	readonly values:V[];
}


export interface IVersionConfig {
isDebug : boolean;
index : number;
version : number;
desc : number[];
book : string[];

}