@echo off
echo Adding responsive media styles to all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0add-responsive-media.ps1"
echo.
echo Script completed.
pause 