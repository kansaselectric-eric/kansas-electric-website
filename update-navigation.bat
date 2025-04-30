@echo off
echo Updating navigation script references...
powershell -ExecutionPolicy Bypass -File "%~dp0update-navigation.ps1"
echo.
echo Navigation script update complete!
pause 