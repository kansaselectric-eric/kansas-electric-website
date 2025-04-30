@echo off
echo Adding mobile-responsive CSS to all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0add-mobile-css.ps1"
echo.
echo Script completed.
pause 