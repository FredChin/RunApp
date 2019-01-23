@echo off
echo RunApp Installer
echo 1 Install
echo 2 Cancel
echo.

choice /c 12 /m "Please choose"
if errorlevel 1 goto Install
if errorlevel 2 goto End
goto End

:Install
cscript installer.jse install
echo Install complete, have fun!
pause

:End
