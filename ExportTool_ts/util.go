package main

import (
	"bufio"
	"bytes"
	"compress/zlib"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
)

// 执行循环编译
func Do(m map[string]bool) ([]*ExportResult, []*ExportTable) {
	results := []*ExportResult{}
	tables := []*ExportTable{}
	for k, _ := range m {
		fileName := k
		flag, result, table := getTableResult(fileName)
		m[fileName] = flag
		if flag {
			fmt.Println(fileName + "转换成功")
			results = append(results, result)
			tables = append(tables, table)
		}
	}

	return results, tables
}

// 读取文件
func getTableResult(fileName string) (bool, *ExportResult, *ExportTable) {
	path := GetWriteDir(fileName)
	file, err := os.OpenFile(path, os.O_RDONLY, os.ModePerm)
	if err != nil {
		CheckError(err, "文件读取失败")
		return false, nil, nil
	}
	defer file.Close()

	tableLength := 0
	tableIndex := 0
	reader := csv.NewReader(bufio.NewReader(file))
	table := &ExportTable{}
	lines := []*ExportLine{}
	for {
		line, err := reader.Read()
		if err != nil {
			isEOF := strings.Contains(err.Error(), "EOF")
			if isEOF {
				//fmt.Println("eof")
				break
			} else {
				CheckError(err, fileName+"读取csv失败")
				return false, nil, nil
			}
		}

		curentRowLenght := len(line)
		if tableLength == 0 {
			tableLength = curentRowLenght
			fmt.Println(fileName+"表格列数:", len(line))
			buildTable(fileName, table)
		}
		// fmt.Println(fmt.Sprintf("本行%d列", curentRowLenght), ",", line)

		switch tableIndex {
		case 0:
			buildHeaderType(line, table)
		case 1:
			buildHeader(line, table)
		default:
			lines = append(lines, buildLine(tableLength, line, table.Header))
		}

		tableIndex++
	}
	table.Lines = lines

	result := buildResult(table)
	writeJsonFile(result)
	//LoadZlibTest(result)
	//writeZlib(result)
	return true, result, table
}

// 判断文件是否存在  存在返回 true 不存在返回false
func checkFileIsExist(filename string) bool {
	var exist = true
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		// checkError(err, "文件不存在")
		exist = false
	}
	return exist
}

// 检查错误
func CheckError(e error, msg string) {
	if e != nil {
		fmt.Println(msg + "," + e.Error())
		log.Fatal(e)
	}
}

//进行zlib解压缩
func zlibDecompress(compressSrc []byte) []byte {
	b := bytes.NewReader(compressSrc)
	var out bytes.Buffer
	r, err := zlib.NewReader(b)
	if err != nil {
		CheckError(err, "zlib decompress error")
		return []byte{}
	}

	io.Copy(&out, r)
	return out.Bytes()
}

//进行zlib压缩
func zlibCompress(src []byte, level int) []byte {
	var in bytes.Buffer
	//w := zlib.NewWriter(&in)
	// 设置压缩级别
	w, _ := zlib.NewWriterLevel(&in, level)
	w.Write(src)
	w.Close()
	return in.Bytes()
}

// 转换json
func convertJson(res *ExportResult) string {
	data, _ := json.Marshal(res)
	json := string(data)
	//fmt.Println(json)
	return json
}

// 转换json
func convertJsonForArray(res []*ExportResult) string {
	data, _ := json.Marshal(res)
	json := string(data)
	//fmt.Println(json)
	return json
}

// 写入文件
func writeToFile(fileName string, data string) {
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
		CheckError(err, fileName+"Json文件创建失败")
		return
	}

	buf := bufio.NewWriter(file) //创建新的 Writer 对象
	buf.WriteString(data)
	buf.Flush()
	defer file.Close()
}

// 写入json
func writeJsonFile(res *ExportResult) {
	fileName := res.Name + ".json"
	jsonData := convertJson(res)

	//写文件
	path := GetWriteDir(fileName)
	writeToFile(path, jsonData)
	fmt.Println(fileName + "Json文件写入成功")
}

// 写入Zlib
// func writeZlib(res *ExportResult) {
// 	level := zlib.DefaultCompression
// 	// fileName := fmt.Sprintf("config_%d.bin", level)
// 	fileName := "config.bin"
// 	jsonData := convertJson(res)
// 	compressData := zlibCompress([]byte(jsonData), level)
// 	zlibData := string(compressData)

// 	//写文件
// 	path := GetWriteDir(fileName)
// 	writeToFile(path, zlibData)

// 	fmt.Println(fileName + "Zlib文件写入成功")
// }

// 写入Zlib
func WriteZlib(res []*ExportResult) {
	level := zlib.DefaultCompression
	// fileName := fmt.Sprintf("config_%d.bin", level)
	fileName := "config.bin"
	jsonData := convertJsonForArray(res)
	compressData := zlibCompress([]byte(jsonData), level)
	zlibData := string(compressData)

	//写文件
	path := GetWriteDir(fileName)
	writeToFile(path, zlibData)

	fmt.Println(fileName + "Zlib文件写入成功")
}
