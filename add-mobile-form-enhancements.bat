@echo off
echo Adding mobile form field enhancements to all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0add-mobile-form-enhancements.ps1"
echo.
echo Script completed.
pause 