@echo off
echo Fixing submenu positioning in newly created pages...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-submenu-position.ps1"
echo.
echo Submenu position fix complete!
pause 