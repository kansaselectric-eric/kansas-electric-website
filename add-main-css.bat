@echo off
echo Adding main.css to all HTML pages...
powershell -ExecutionPolicy Bypass -File "%~dp0add-main-css.ps1"
echo.
pause 