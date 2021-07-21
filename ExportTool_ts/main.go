package main

import (
	"github.com/andlabs/ui"
	_ "github.com/andlabs/ui/winmanifest"
)

// 补充比较全的例子
func Example() {
	err := ui.Main(func() {
		//生成输入框
		input := ui.NewEntry()
		input.SetText("这是一个输入框")
		input.LibuiControl()

		//生成范围框
		spinbox := ui.NewSpinbox(50, 150)
		spinbox.SetValue(55)

		//生成滑片
		slider := ui.NewSlider(0, 100)
		slider.SetValue(10)

		//生成进度条
		processbar := ui.NewProgressBar()
		processbar.SetValue(10)

		//生成多选框
		combobox := ui.NewCombobox()
		combobox.Append("选择1")
		combobox.Append("选择2")
		combobox.Append("选择3")
		combobox.SetSelected(2)

		//生成单选框
		checkbox1 := ui.NewCheckbox("Go语言")
		checkbox1.SetChecked(true)

		//生成下拉框
		checkbox2 := ui.NewCheckbox("qqhd.me")
		checkbox3 := ui.NewCheckbox("Python")
		checkbox4 := ui.NewCheckbox("Other")

		checkbox_div := ui.NewHorizontalBox()
		checkbox_div.Append(checkbox1, true)
		checkbox_div.Append(checkbox2, true)
		checkbox_div.Append(checkbox3, true)
		checkbox_div.Append(checkbox4, true)

		radio := ui.NewRadioButtons()
		radio.Append("Go语言")
		radio.Append("qqhd.me")
		radio.Append("Python")
		radio.Append("Other")

		checkbox_div.SetPadded(true)

		Separator := ui.NewHorizontalSeparator()
		Separator_label_l := ui.NewLabel("left")
		Separator_label_r := ui.NewLabel("right")

		Separator_div := ui.NewHorizontalBox()
		Separator_div.Append(Separator_label_l, true)
		Separator_div.Append(Separator, false)
		Separator_div.Append(Separator_label_r, true)
		Separator_div.SetPadded(true)
		datetimepicker := ui.NewDateTimePicker()

		//---------------------将单个子项设置为新组-----------------
		conT1 := ui.NewGroup("输入框")
		conT1.SetChild(input)

		conT2 := ui.NewGroup("设值范围框，只能通过箭头控制值，不能手动输入")
		conT2.SetChild(spinbox)

		conT3 := ui.NewGroup("滑片")
		conT3.SetChild(slider)

		conT4 := ui.NewGroup("进度条")
		conT4.SetChild(processbar)

		conT5 := ui.NewGroup("多选框")
		conT5.SetChild(checkbox_div)

		cont6 := ui.NewGroup("单选框")
		cont6.SetChild(radio)

		cont7 := ui.NewGroup("下拉框")
		cont7.SetChild(combobox)

		cont8 := ui.NewGroup("分隔符")
		cont8.SetChild(Separator_div)

		cont9 := ui.NewGroup("时间选取器")
		cont9.SetChild(datetimepicker)

		//------垂直排列的容器---------
		div := ui.NewVerticalBox()

		//------水平排列的容器
		boxs_1 := ui.NewHorizontalBox()
		boxs_1.Append(conT1, true)
		boxs_1.Append(conT2, true)

		boxs_1.SetPadded(false)

		boxs_2 := ui.NewHorizontalBox()
		boxs_2.Append(conT3, true)
		boxs_2.Append(conT4, true)

		boxs_3 := ui.NewHorizontalBox()
		boxs_3.Append(conT5, true)
		boxs_3.Append(cont6, true)

		boxs_4 := ui.NewHorizontalBox()
		boxs_4.Append(cont7, true)
		boxs_4.Append(cont8, true)

		div.Append(boxs_1, true)
		div.Append(boxs_2, true)
		div.Append(boxs_3, true)
		div.Append(boxs_4, true)
		div.Append(cont9, true)
		div.SetPadded(false)

		window := ui.NewWindow("测试软件", 600, 600, true)

		window.SetChild(div)
		window.SetMargined(true)

		window.OnClosing(func(*ui.Window) bool {
			ui.Quit()
			return true
		})
		window.Show()
	})

	if err != nil {
		panic(err)
	}
}

func ShowGUI() {
	err := ui.Main(func() {
		// 生成：标签
		greeting := ui.NewLabel("导表工具1.0")
		// 生成：标签
		result := ui.NewLabel("无进程")
		// 生成：按钮
		button := ui.NewButton("导表")
		// 设置：按钮点击事件
		button.OnClicked(func(*ui.Button) {
			result.SetText("无进程")
			button.Hide()
			Export()
			button.Show()
			result.SetText("导出成功")
		})
		// 生成：垂直容器
		box := ui.NewVerticalBox()

		// 往 垂直容器 中添加 控件
		box.Append(greeting, false)
		box.Append(button, false)
		box.Append(result, false)

		// 生成：窗口（标题，宽度，高度，是否有 菜单 控件）
		window := ui.NewWindow(`导表工具1.0 by DongTech`, 360, 240, true)

		// 窗口容器绑定
		window.SetChild(box)

		// 设置：窗口关闭时
		window.OnClosing(func(*ui.Window) bool {
			// 窗体关闭
			ui.Quit()
			return true
		})

		// 窗体显示
		window.Show()
	})
	if err != nil {
		panic(err)
	}

	// 编译go build 不需要显示窗体
	// go build  -ldflags="-H windowsgui"
}

func ShowCMD() {
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
	pause()
}

// 程序入口
// author : dongtech
// time : 20210527
func main() {
	// GUI显示
	ShowGUI()
	// CMD显示
	//ShowCMD()
}
