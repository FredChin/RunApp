@echo off
echo ������װRunApp
echo 1 ��װ
echo 2 ȡ��
echo.
choice /c 12 /m ��ѡ��
if errorlevel 2 goto End
if errorlevel 1 goto Install

:Install
cscript installer.js install
goto Complete

:Complete
echo ��װ��� Enjoy it
pause

:End