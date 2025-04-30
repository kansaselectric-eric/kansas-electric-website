@echo off
echo Fixing submenu positioning in newly created pages (direct edit)...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-submenu-direct.ps1"
echo.
echo Submenu position fix complete!
pause 