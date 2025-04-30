@echo off
echo Adding responsive typography styles to all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0add-responsive-typography.ps1"
echo.
echo Script completed.
pause 