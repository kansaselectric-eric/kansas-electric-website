@echo off
echo Applying final submenu positioning fix...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-submenu-final.ps1"
echo.
echo Final submenu fix complete!
pause 