@echo off
echo Adding mobile hamburger menu to all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0add-mobile-hamburger.ps1"
echo.
echo Script completed.
pause 