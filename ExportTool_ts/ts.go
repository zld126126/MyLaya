package main

import (
	"bufio"
	"fmt"
	"os"
)

const (
	TS_NUMBE        = "number"
	TS_STRING       = "string"
	TS_NUMBER_ARRAY = "number[]"
	TS_STRING_ARRAY = "string[]"
	TS_BOOLEAN      = "boolean"
	TS_TEMPLATE     = `
export default class ConfigManager{
%s
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

%s`
	// public static readonly soundTpl:IMap<ISoundConfig>;
	TS_TEMPLATE_PROPERTY = `public static readonly %sTpl:IMap<I%sConfig>;`

	// export interface ILanguageConfig {paramName:string;value:string;}
	TS_TEMPLATE_INTERFACE = `
export interface I%sConfig {
%s
}`
	TS_TEMPLATE_INTERFACE_PROPERTY = `%s : %s;`
)

func MakeTS(results []*ExportTable) {
	fileName := "ConfigManager.ts"
	path := GetTsFileDir(fileName)
	prop := buildTSProperty(results)
	inter := buildTSInterface(results)
	data := fmt.Sprintf(TS_TEMPLATE, prop, inter)
	WriteTS(path, data)
}

func buildTSProperty(results []*ExportTable) string {
	res := ""
	for _, v := range results {
		propertyName := v.TableName
		res += fmt.Sprintf(TS_TEMPLATE_PROPERTY, propertyName, propertyName) + "\n"
	}
	return res
}

func getTypeForInterfaceProperty(tp *ExportType) string {
	switch tp.Type {
	case DATATYPE_NUMBER:
		return TS_NUMBE
	case DATATYPE_STRING:
		return TS_STRING
	case DATATYPE_NUMBER_ARRAY:
		return TS_NUMBER_ARRAY
	case DATATYPE_STRING_ARRAY:
		return TS_STRING_ARRAY
	case DATATYPE_BOOLEAN:
		return TS_BOOLEAN
	}
	return ""
}

func buildInterfaceProperty(m map[int]*ExportHeader) string {
	res := ""
	for _, v := range m {
		if v.Type.Type == DATATYPE_UNKNOWN {
			continue
		}
		tp := getTypeForInterfaceProperty(v.Type)
		res += fmt.Sprintf(TS_TEMPLATE_INTERFACE_PROPERTY, v.Name, tp) + "\n"
	}
	return res
}

func buildTSInterface(results []*ExportTable) string {
	res := ""
	for _, v := range results {
		propertyName := v.TableName
		propertyData := buildInterfaceProperty(v.Header)
		res += fmt.Sprintf(TS_TEMPLATE_INTERFACE, propertyName, propertyData)
	}
	return res
}

func WriteTS(fileName string, data string) {
	if checkFileIsExist(fileName) {
		err := os.Remove(fileName)
		if err != nil {
			CheckError(err, "文件未删除")
			return
		} else {
			fmt.Println(fileName + "删除成功")
		}
	}

	file, err := os.Create(fileName) //创建文件
	if err != nil {
		CheckError(err, fileName+"TS文件创建失败")
		return
	}
	// 解决中文乱码问题
	file.WriteString("\xEF\xBB\xBF")
	buf := bufio.NewWriter(file) //创建新的 Writer 对象
	buf.WriteString(data)
	buf.Flush()
	defer file.Close()
}
