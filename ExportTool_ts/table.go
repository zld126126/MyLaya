package main

import (
	"fmt"
	"strconv"
	"strings"
)

type DataType int32

// 数据类型
const (
	DATATYPE_UNKNOWN      DataType = iota // 未知类型
	DATATYPE_NUMBER                       // 数字
	DATATYPE_STRING                       // 字符串
	DATATYPE_NUMBER_ARRAY                 // 数字数组
	DATATYPE_STRING_ARRAY                 // 字符串数组
	DATATYPE_BOOLEAN                      // 布尔类型
)

type ExportType struct {
	Type    DataType `json:"Type"`    // 类型
	Primary bool     `json:"Primary"` // 是否主键
}

// 转换表
type ExportTable struct {
	TableName  string                `json:"TableName"`  // 表名
	HeaderType map[int]*ExportType   `json:"HeaderType"` // 表头类型
	Header     map[int]*ExportHeader `json:"Header"`     // 表头
	Lines      []*ExportLine         `json:"Lines"`      // 多行内容
}

type ExportHeader struct {
	Index int         `json:"Index"` // 表头位置
	Name  string      `json:"Name"`  // 表头名称
	Type  *ExportType `json:"Type"`  // 类型
}

// 转换表 行内容
type ExportLine struct {
	M map[int]*ExportRow `json:"M"` // 多个表格
}

// 转换表 单格内容
type ExportRow struct {
	Index int         `json:"Index"` // 游标
	Name  string      `json:"Name"`  // 冗余表头
	Type  *ExportType `json:"Type"`  // 类型
	S     string      `json:"S"`     // 字符串内容
	I     int         `json:"I"`     // 数字内容
	SA    []string    `json:"SA"`    // 字符串数组
	IA    []int       `json:"IA"`    // 数字数组
	B     bool        `json:"B"`     // 布尔
}

// 导出结果
type ExportResult struct {
	Name string                 `json:"name"`
	Data map[string]interface{} `json:"data"`
}

// 根据数据 开始自定义反射表格
func buildTable(fileName string, table *ExportTable) {
	tableName := ""
	if strings.Contains(fileName, ".csv") {
		n := fileName
		tableName = strings.Replace(n, ".csv", "", -1)
	}

	table.TableName = tableName
	fmt.Println(tableName + "开始反射")
}

// build 表头类型
func buildHeaderType(array []string, table *ExportTable) {
	m := make(map[int]*ExportType)
	for i, v := range array {
		primary := false
		if strings.Contains(v, "[key]") {
			primary = true
		}

		tp := DATATYPE_UNKNOWN
		if strings.Contains(v, "[n]") {
			tp = DATATYPE_NUMBER
		} else if strings.Contains(v, "[s]") {
			tp = DATATYPE_STRING
		} else if strings.Contains(v, "[na]") {
			tp = DATATYPE_NUMBER_ARRAY
		} else if strings.Contains(v, "[sa]") {
			tp = DATATYPE_STRING_ARRAY
		} else if strings.Contains(v, "[b]") {
			tp = DATATYPE_BOOLEAN
		}

		exportType := &ExportType{
			Type:    tp,
			Primary: primary,
		}
		m[i] = exportType
	}
	table.HeaderType = m
}

// build 表头
func buildHeader(array []string, table *ExportTable) {
	m := make(map[int]*ExportHeader)
	for i, v := range array {
		head := &ExportHeader{
			Name:  v,
			Index: i,
			Type:  table.HeaderType[i],
		}
		m[i] = head
	}
	table.Header = m
}

// build 一行数据
func buildLine(length int, array []string, head map[int]*ExportHeader) *ExportLine {
	m := make(map[int]*ExportRow)
	line := &ExportLine{}
	for i := 0; i < length; i++ {
		headTitle := head[i].Name
		tp := head[i].Type
		if headTitle == "" || tp.Type == DATATYPE_UNKNOWN {
			continue
		}

		if i < len(array) {
			row := buildRow(array[i], i, head)
			m[row.Index] = row
		} else {
			row := buildDefaultRow(i, head)
			m[row.Index] = row
		}
	}
	line.M = m
	return line
}

// build 一个单元格
func buildRow(v string, i int, head map[int]*ExportHeader) *ExportRow {
	tp := head[i].Type
	row := &ExportRow{
		Name:  head[i].Name,
		Type:  tp,
		Index: i,
	}
	switch tp.Type {
	case DATATYPE_NUMBER:
		i := 0
		if v != "" {
			i = convertToInt(v)
		}
		row.I = i
		return row
	case DATATYPE_STRING:
		row.S = v
		return row
	case DATATYPE_NUMBER_ARRAY:
		row.IA = []int{}
		if v != "" {
			sArray := strings.Split(v, "|")
			iArray := convertToIntArray(sArray)
			row.IA = iArray
		}
		return row
	case DATATYPE_STRING_ARRAY:
		row.SA = []string{}
		if v != "" {
			sArray := strings.Split(v, "|")
			row.SA = sArray
		}
		return row
	case DATATYPE_BOOLEAN:
		flag := false
		// xlsx 会把 true 识别为 1 false 识别为 0
		if v == "1" {
			flag = true
		}
		row.B = flag
		return row
	}
	return row
}

// build 默认单元格
func buildDefaultRow(i int, head map[int]*ExportHeader) *ExportRow {
	tp := head[i].Type
	row := &ExportRow{
		Name:  head[i].Name,
		Type:  tp,
		Index: i,
	}
	switch tp.Type {
	case DATATYPE_NUMBER:
		row.I = 0
		return row
	case DATATYPE_STRING:
		row.S = ""
		return row
	case DATATYPE_NUMBER_ARRAY:
		row.IA = []int{}
		return row
	case DATATYPE_STRING_ARRAY:
		row.SA = []string{}
		return row
	case DATATYPE_BOOLEAN:
		row.B = false
		return row
	}
	return row
}

// 获取单元格值
func getRowValue(row *ExportRow) interface{} {
	switch row.Type.Type {
	case DATATYPE_NUMBER:
		return row.I
	case DATATYPE_STRING:
		return row.S
	case DATATYPE_NUMBER_ARRAY:
		return row.IA
	case DATATYPE_STRING_ARRAY:
		return row.SA
	case DATATYPE_BOOLEAN:
		return row.B
	}
	return ""
}

func getPrimaryKeyValue(row *ExportRow) string {
	switch row.Type.Type {
	case DATATYPE_NUMBER:
		return fmt.Sprint(row.I)
	case DATATYPE_STRING:
		return fmt.Sprint(row.S)
	case DATATYPE_NUMBER_ARRAY:
		return fmt.Sprint(row.IA)
	case DATATYPE_STRING_ARRAY:
		return fmt.Sprint(row.SA)
	case DATATYPE_BOOLEAN:
		return fmt.Sprint(row.B)
	}
	return ""
}

// 转换int
func convertToInt(s string) int {
	if s == "" {
		return 0
	}

	i, err := strconv.Atoi(s)
	if err != nil {
		CheckError(err, s+"转换int error")
		return 0
	}

	return i
}

// 转换int数组
func convertToIntArray(arr []string) []int {
	if len(arr) == 0 {
		return []int{}
	}
	result := []int{}
	for i := 0; i < len(arr); i++ {
		v := arr[i]
		if v != "" {
			num, err := strconv.Atoi(arr[i])
			if err != nil {
				CheckError(err, arr[i]+"转换int array error")
				result[i] = 0
				continue
			}
			result = append(result, num)
		} else {
			result = append(result, 0)
		}
	}
	return result
}

// build结果
func buildResult(table *ExportTable) *ExportResult {
	res := &ExportResult{}
	res.Name = table.TableName
	dMap := make(map[string]interface{})

	lines := table.Lines
	for i := 0; i < len(lines); i++ {
		m := make(map[string]interface{})
		var key = ""
		for _, v := range lines[i].M {
			if v.Type.Primary {
				key = getPrimaryKeyValue(v)
			}
			m[v.Name] = getRowValue(v)

		}
		dMap[key] = m
	}
	res.Data = dMap
	return res
}

func PrintByCommand(command string) {
	fmt.Println("========================")
	fmt.Println(command)
	fmt.Println("========================")
}

// 参考CMD语法 等待用户随机指令关闭程序
func pause() {
	var str string
	fmt.Println("")
	fmt.Print("请按任意键继续...")
	fmt.Scanln(&str)
	fmt.Print("程序退出...")
}

// 导表
func Export() {
	PrintByCommand("1.导表开始")
	// 业务
	arr := GetExcelMap()
	csvMap := MakeCsvMap(arr)
	PrintByCommand("2.Csv转换成功")

	results, tables := Do(csvMap)
	WriteZlib(results)
	PrintByCommand("3.Config.bin写入成功")

	MakeTS(tables)
	PrintByCommand("4.TS写入成功")

	//DelUnusedFile()
	//PrintByCommand("5.无用文件删除成功")

	PrintByCommand("6.导表结束")
	//pause()
}
