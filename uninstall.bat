@echo off 
cls
echo ����ж��RunApp
echo 1 ж�س���
echo 2 ж�س���ɾ���û�����
echo 3 ȡ��ж��
echo.
choice /c 123 /m ��ѡ��
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
echo ж����� Good luck
pause

:End