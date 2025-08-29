:: I keep this tiny batch as a convenience runner.
@echo off
echo Creating missing pages for all submenu items...
powershell -ExecutionPolicy Bypass -File "%~dp0create-missing-pages.ps1"
echo.
echo Press any key to exit...
pause > nul 