@echo off
set /p version=Please Write Version(1.0.0.0):
echo You Write Version %version%

echo ------------------------------
echo 1.1 start clean unused file
echo ------------------------------
:: 1.需要清理的文件名
set "file1=unpack.json"
set "file2=version.json"
set "file3=wxgame"
:: 版本相关
set "file77=%version%"
set "file88=%version%.zip"
:: 为了支持zip随机,记录bat文件夹位置
cd ../release/%file3%

if exist "%file1%" ( 
    del %file1%
    echo.delete success %file1%
) else (
    echo.not found %file1%
)

if exist "%file2%" ( 
    del %file2%
    echo.delete success %file2%
) else (
    echo.not found %file2%
)
echo ------------------------------
echo 1.2 clean unused file done
echo ------------------------------

:: 2.压缩打包
echo ------------------------------
echo 2.1 start zip project
echo ------------------------------
:: cd ../../
:: 复制文件夹
:: xcopy wxgame %file77% /e /i
:: rename %file66% %file77%
:: %file100%/zip.exe -r %file88% %file77%/*
echo ------------------------------
echo 2.2 zip project done
echo ------------------------------

:: 3.整理微信包
echo ------------------------------
echo 3.1 start build wx package
echo ------------------------------
:: 清理之前的项目文件夹
cd ../
rd /s/q %file77%
rename %file3% %file77%
echo ------------------------------
echo 3.1 build wx package
echo ------------------------------

pause