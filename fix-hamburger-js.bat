@echo off
echo Fixing mobile hamburger menu JavaScript placement in HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-hamburger-js.ps1"
echo.
echo Script completed.
pause 