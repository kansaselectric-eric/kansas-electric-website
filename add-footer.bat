@echo off
echo Adding footer to all HTML pages...
powershell -ExecutionPolicy Bypass -File "%~dp0add-footer.ps1"
echo.
echo Footer update complete!
pause 