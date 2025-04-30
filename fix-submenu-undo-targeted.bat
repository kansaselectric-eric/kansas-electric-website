@echo off
echo Undoing targeted submenu positioning fix...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-submenu-undo-targeted.ps1"
echo.
echo Targeted submenu fix removal complete!
pause 