@echo off
echo Removing Fanuc logo from HTML files...

:: For relative paths in root directory
powershell -Command "Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object { $content = Get-Content -Path $_.FullName -Raw; $newContent = $content -replace '<li class=\"md:self-center text-ke-gray-light max-w-sm mb-6 md:mb-0 md:text-right\"><a href=\"https://www.fanucamerica.com/\"><img class=\"w-auto h-20\" src=\"\./assets/img/fanuc-logo\.png\" alt=\"FANUC Authorized System Integrator\" title=\"FANUC Authorized System Integrator\" width=\"250\" height=\"250\"></a></li>', ''; Set-Content -Path $_.FullName -Value $newContent }"

:: For paths with ../assets/img/
powershell -Command "Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object { $content = Get-Content -Path $_.FullName -Raw; $newContent = $content -replace '<li class=\"md:self-center text-ke-gray-light max-w-sm mb-6 md:mb-0 md:text-right\"><a href=\"https://www.fanucamerica.com/\"><img class=\"w-auto h-20\" src=\"\.\./assets/img/fanuc-logo\.png\" alt=\"FANUC Authorized System Integrator\" title=\"FANUC Authorized System Integrator\" width=\"250\" height=\"250\"></a></li>', ''; Set-Content -Path $_.FullName -Value $newContent }"

:: For paths with ../../assets/img/
powershell -Command "Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object { $content = Get-Content -Path $_.FullName -Raw; $newContent = $content -replace '<li class=\"md:self-center text-ke-gray-light max-w-sm mb-6 md:mb-0 md:text-right\"><a href=\"https://www.fanucamerica.com/\"><img class=\"w-auto h-20\" src=\"\.\.\./assets/img/fanuc-logo\.png\" alt=\"FANUC Authorized System Integrator\" title=\"FANUC Authorized System Integrator\" width=\"250\" height=\"250\"></a></li>', ''; Set-Content -Path $_.FullName -Value $newContent }"

:: For paths with ../../../assets/img/
powershell -Command "Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object { $content = Get-Content -Path $_.FullName -Raw; $newContent = $content -replace '<li class=\"md:self-center text-ke-gray-light max-w-sm mb-6 md:mb-0 md:text-right\"><a href=\"https://www.fanucamerica.com/\"><img class=\"w-auto h-20\" src=\"\.\.\.\./assets/img/fanuc-logo\.png\" alt=\"FANUC Authorized System Integrator\" title=\"FANUC Authorized System Integrator\" width=\"250\" height=\"250\"></a></li>', ''; Set-Content -Path $_.FullName -Value $newContent }"

echo Fanuc logo removed from all HTML files successfully.
pause 