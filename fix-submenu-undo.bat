@echo off
echo Undoing final submenu positioning fix...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-submenu-undo.ps1"
echo.
echo Submenu fix has been removed!
pause 