:: I keep this tiny batch as a convenience runner.
@echo off
echo Removing ticker from all pages except index.html...

:: Find and replace the entire ticker container section with just the 24/7 support div in all HTML files except index.html
powershell -Command "$excludeFile = 'index.html'; Get-ChildItem -Path . -Filter *.html -Recurse | Where-Object { $_.Name -ne $excludeFile } | ForEach-Object { 
    $content = Get-Content -Path $_.FullName -Raw; 
    
    # Replace the entire ticker container and structure with just the 24/7 support div
    $tickerPattern = '<div class=\"bg-ke-blue\">\s*<div class=\"md:w-11\/12 mx-auto flex flex-row md:items-center\">\s*<div class=\"ticker-container flex-grow\">[^<]*<div class=\"ticker-wrapper\">[^<]*<div class=\"ticker-scroll\">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class=\"flex-shrink-0 whitespace-nowrap\">'
    $replacement = '<div class=\"bg-ke-blue\">\s*<div class=\"md:w-11\/12 mx-auto flex flex-row md:items-center justify-end\">\s*<div class=\"flex-shrink-0 whitespace-nowrap\">'
    
    $modifiedContent = $content -replace $tickerPattern, $replacement;
    
    # Remove ticker-related styles
    $stylePattern = '\/\* News Ticker Styles \*\/[\s\S]*?@keyframes ticker[\s\S]*?}\s*}\s*@media \(max-width: 768px\) {\s*\.ticker-item {\s*padding: 0 15px;\s*font-size: 12px;\s*}\s*'
    $modifiedContent = $modifiedContent -replace $stylePattern, '';
    
    Set-Content -Path $_.FullName -Value $modifiedContent;
    
    Write-Host \"Processed: \" + $_.Name
}"

echo Ticker removed from all pages except index.html successfully.
pause 