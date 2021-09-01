# 自定义字体(html项目)
## js项目
    优势:
        默认全局生效
        设置字体粗细font-weight: normal/bold/100/200 等等

    如 index.html:
        {font-family: myFirstFont;src: url('http://www.mywebsite.com/fonts/Font.ttf');font-weight: bold;}

    参考网址:
    https://www.w3school.com.cn/css/css3_fonts.asp
    
## TODO Laya项目兼容
    参考例子:
        @font-face {
            /* font-test*/
            font-family: xxx;
            src:url('font/xxx.woff'),
            url('font/xxx-web.ttf'),
            url('font/xxx-web.eot'); /* IE9 */
        }