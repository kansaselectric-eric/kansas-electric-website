@echo off
echo Converting absolute paths to relative paths...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-paths-final.ps1"
echo.
echo Path conversion complete!
echo.
pause 