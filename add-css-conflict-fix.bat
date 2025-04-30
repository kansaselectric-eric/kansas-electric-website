@echo off
echo Adding CSS conflict fix to all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0add-css-conflict-fix.ps1"
echo.
echo Script completed.
pause 