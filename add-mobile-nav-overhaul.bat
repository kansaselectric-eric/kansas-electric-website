@echo off
echo Adding S-tier mobile navigation overhaul to all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0add-mobile-nav-overhaul.ps1"
echo.
echo Script completed.
pause 