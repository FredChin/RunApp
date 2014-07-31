@echo off 
cls
echo 即将卸载RunApp
echo 1 卸载程序
echo 2 卸载程序并删除用户数据
echo 3 取消卸载
echo.
choice /c 123 /m 请选择
if errorlevel 3 goto End
if errorlevel 2 goto UninstallAndRemoveUserData
if errorlevel 1 goto Uninstall
goto End

:UninstallAndRemoveUserData
cscript installer.js uninstall
rmdir /s /q "%AppData%\Microsoft\Windows\Command Shortcuts"
goto Complete

:Uninstall
cscript installer.js uninstall
goto Complete

:Complete
echo 卸载完成 Good luck
pause

:End