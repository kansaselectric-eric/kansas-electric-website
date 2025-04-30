@echo off
echo Applying targeted submenu positioning fix...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-submenu-targeted.ps1"
echo.
echo Targeted submenu fix complete!
pause 