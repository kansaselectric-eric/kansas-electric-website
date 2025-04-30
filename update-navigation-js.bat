@echo off
echo Updating navigation-fixed.js with the content from navigation.js...
powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0update-navigation-js.ps1"
if %ERRORLEVEL% EQU 0 (
    echo Update completed successfully!
) else (
    echo Error: Update failed with error code %ERRORLEVEL%
)
echo.
echo Press any key to exit...
pause > nul