:: I keep this tiny batch as a convenience runner.
@echo off
echo Adding main.css and necessary JavaScript files to all HTML pages...
powershell -ExecutionPolicy Bypass -File "%~dp0add-scripts.ps1"
echo.
pause 