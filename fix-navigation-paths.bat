@echo off
echo Running script to fix navigation-fixed.js paths in all HTML files...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-navigation-paths.ps1"
echo.
echo Script completed.
pause 