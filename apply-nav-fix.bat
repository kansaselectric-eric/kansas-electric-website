@echo off
powershell.exe -ExecutionPolicy Bypass -File "%~dp0apply-nav-fix.ps1"
echo.
echo Navigation Fix applied. Press any key to close...
pause > nul 