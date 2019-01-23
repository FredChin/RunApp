@echo off 
cls
echo RunApp Uninstaller
echo 1 Uninstall
echo 2 Uninstall and remove user data
echo 3 Cancel
echo.

choice /c 123 /m "Please choose"
if errorlevel 1 goto Uninstall
if errorlevel 2 goto UninstallAndRemoveUserData
if errorlevel 3 goto End
goto End

:UninstallAndRemoveUserData
cscript installer.jse uninstall
rmdir /s /q "%AppData%\Microsoft\Windows\Command Shortcuts"
goto Complete

:Uninstall
cscript installer.jse uninstall
goto Complete

:Complete
echo Uninstall complete
pause

:End
