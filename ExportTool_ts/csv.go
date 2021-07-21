package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/tealeg/xlsx"
)

// 读取需要转换的目录
func GetExcelMap() map[string]string {
	pwd := GetConfigDir()
	fileAmout := 0
	m := make(map[string]string)
	filepath.Walk(pwd, func(path string, info os.FileInfo, err error) error {
		fileName := path + info.Name()
		if !strings.Contains(fileName, "~$") {
			//打印当前文件或目录下的文件或目录名
			if strings.Contains(fileName, "xlsx") {
				fileAmout++
				m[info.Name()] = path
			} else if strings.Contains(fileName, "csv") {
				fileAmout++
				m[info.Name()] = path
			}
		}
		return nil
	})
	fmt.Println("csv文件总数:", fileAmout)
	return m
}

func MakeCsvMap(fileMap map[string]string) map[string]bool {
	m := make(map[string]bool)
	for k, v := range fileMap {

		if strings.Contains(k, "csv") {
			m[k] = false
			copyPath := GetWriteDir(k)
			copyCsv(v, copyPath)
			continue
		}

		fileName := strings.ReplaceAll(k, ".xlsx", "")
		fileName = fileName + ".csv"
		writePath := GetWriteDir(fileName)
		parseCsv(v, writePath)
		m[fileName] = false
	}
	printCsvMap(m)
	return m
}

func printCsvMap(m map[string]bool) {
	for k, _ := range m {
		fmt.Println(k)
	}
}

func parseCsv(path string, toFile string) {
	excelTable, err := xlsx.OpenFile(path)
	if err != nil {
		CheckError(err, "excel文件读取错误")
		return
	}

	//写入数据到文件
	csvTable, err := os.OpenFile(toFile, os.O_RDWR|os.O_CREATE, os.ModePerm)
	if err != nil {
		CheckError(err, "csv文件打开失败")
		return
	}
	defer csvTable.Close()
	// 解决中文乱码问题
	csvTable.WriteString("\xEF\xBB\xBF")
	writer := csv.NewWriter(csvTable)

	sheet := excelTable.Sheets[0]
	rows := sheet.MaxRow
	for i := 0; i < rows; i++ {
		cols := sheet.MaxCol
		values := []string{}
		for j := 0; j < cols; j++ {
			cell := sheet.Cell(i, j)
			val := cell.Value
			values = append(values, val)
		}
		writer.Write(values)
	}
	writer.Flush()
	fmt.Println(toFile + "转换成功")
}

// 复制csv
func copyCsv(srcName string, dstName string) {
	src, err := os.Open(srcName)
	if err != nil {
		return
	}
	defer src.Close()
	dst, err := os.OpenFile(dstName, os.O_WRONLY|os.O_CREATE, 0644)
	if err != nil {
		CheckError(err, "打开csv错误")
		return
	}
	defer dst.Close()
	_, err = io.Copy(dst, src)
	if err != nil {
		CheckError(err, "复制csv错误")
		return
	}
	fmt.Println("复制csv文件成功")
}
