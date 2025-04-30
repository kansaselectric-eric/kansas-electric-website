@echo off
echo Adding mobile tap target improvements to all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0add-mobile-tap-targets.ps1"
echo.
echo Script completed.
pause 