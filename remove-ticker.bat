@echo off
echo Running script to remove the news ticker from all HTML files except index.html...

:: Execute the PowerShell script with elevated permissions
powershell -ExecutionPolicy Bypass -File "%~dp0remove-ticker.ps1"

echo.
echo Process completed. Press any key to exit...
pause > nul 