package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func substr(s string, pos, length int) string {
	runes := []rune(s)
	l := pos + length
	if l > len(runes) {
		l = len(runes)
	}
	return string(runes[pos:l])
}

// 获取上一级文件夹路径
func GetParentDir(dirctory string) string {
	return substr(dirctory, 0, strings.LastIndex(dirctory, "/"))
}

// 获取当前文件夹路径
func GetCurrentDir() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}
	return strings.Replace(dir, "\\", "/", -1)
}

// 获取配置文件目录
func GetConfigDir() string {
	pwd, _ := os.Getwd()
	// currentDir := GetCurrentDir()
	// parentDir := GetParentDir(currentDir)
	// parentDir2 := GetParentDir(parentDir)
	// pwd := parentDir2 + "\\" + "design"
	return pwd + "\\config"
}

// 获取配置文件目录
func GetResultDir() string {
	pwd, _ := os.Getwd()
	// currentDir := GetCurrentDir()
	// parentDir := GetParentDir(currentDir)
	// parentDir2 := GetParentDir(parentDir)
	// pwd := parentDir2 + "\\" + "client" + "\\" + "bin" + "\\" + "res"
	return pwd + "\\result"
}

// 获取写入文件路径
func GetWriteDir(fileName string) string {
	return GetResultDir() + "\\" + fileName
}

// 获取ts文件写入路径
func GetTsFileDir(fileName string) string {
	pwd, _ := os.Getwd()
	// currentDir := GetCurrentDir()
	// parentDir := GetParentDir(currentDir)
	// parentDir2 := GetParentDir(parentDir)
	// pwd := parentDir2 + "\\" + "client" + "\\" + "src" + "\\" + "game" + "\\" + "core"
	return pwd + "\\config" + "\\" + fileName
}

// 删除无用文件
func DelUnusedFile() {
	pwd := GetResultDir()
	m := make(map[string]string)
	filepath.Walk(pwd, func(path string, info os.FileInfo, err error) error {
		fileName := path + info.Name()
		if !strings.Contains(fileName, "config.bin") {
			//打印当前文件或目录下的文件或目录名
			if strings.Contains(fileName, "json") {
				m[info.Name()] = path
			} else if strings.Contains(fileName, "csv") {
				m[info.Name()] = path
			}
		}
		return nil
	})

	for k, v := range m {
		err := os.Remove(v)
		if err != nil {
			fmt.Println(k + "删除失败")
		} else {
			fmt.Println(k + "删除成功")
		}
	}
}
