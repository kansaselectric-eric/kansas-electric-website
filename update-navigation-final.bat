@echo off
echo Updating navigation script references in all HTML files...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0update-navigation-final.ps1"
echo Navigation script update complete!
pause 