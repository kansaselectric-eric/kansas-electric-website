@echo off
echo Fixing submenu positioning in navigation-fixed.js...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-submenu-js.ps1"
echo.
echo JavaScript fix applied!
pause 