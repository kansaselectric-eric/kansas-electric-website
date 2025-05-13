# PowerShell script to remove the news ticker from all HTML files except index.html
Write-Host "Removing news ticker from all HTML files except index.html..."

# Get all HTML files except index.html
$htmlFiles = Get-ChildItem -Path . -Filter *.html -Recurse | Where-Object { $_.Name -ne "index.html" }

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.Name)..."
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace the ticker container structure with just the support section
    # This pattern matches the entire ticker section
    $tickerPattern = '(?s)<div class="ticker-container flex-grow">.*?<div class="ticker-wrapper">.*?<div class="ticker-scroll">.*?</div>\s*</div>\s*</div>'
    
    # Remove the ticker and adjust the layout
    $modifiedContent = $content -replace $tickerPattern, ""
    
    # Add justify-end to the container to properly position the support section
    $modifiedContent = $modifiedContent -replace '<div class="md:w-11/12 mx-auto flex flex-row md:items-center">', '<div class="md:w-11/12 mx-auto flex flex-row md:items-center justify-end">'
    
    # Remove ticker-related styles
    $tickerStylesPattern = '(?s)/\* News Ticker Styles \*/.*?@keyframes ticker.*?}.*?}.*?@media \(max-width: 768px\) {.*?\.ticker-item {.*?}.*?(\/\* Stack elements on mobile \*/|\s*\/\* Integrated header layout \*/)'
    $modifiedContent = $modifiedContent -replace $tickerStylesPattern, '$1'
    
    # Write the modified content back to the file
    Set-Content -Path $file.FullName -Value $modifiedContent -NoNewline
    
    Write-Host "Completed: $($file.Name)"
}

Write-Host "News ticker removal complete!" 