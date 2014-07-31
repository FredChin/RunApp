@echo off
echo 即将安装RunApp
echo 1 安装
echo 2 取消
echo.
choice /c 12 /m 请选择
if errorlevel 2 goto End
if errorlevel 1 goto Install

:Install
cscript installer.js install
goto Complete

:Complete
echo 安装完成 Enjoy it
pause

:End