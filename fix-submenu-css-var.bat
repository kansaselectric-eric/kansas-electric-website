@echo off
echo Adding CSS variable declaration to HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-submenu-css-var.ps1"
echo.
echo CSS variable declaration added!
pause 