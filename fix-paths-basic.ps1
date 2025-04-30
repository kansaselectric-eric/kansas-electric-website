# Basic PowerShell script to fix absolute paths in website files

# Get all HTML files in the website
$htmlFiles = Get-ChildItem -Path $PSScriptRoot -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    # Determine relative path prefix
    $relativePath = $file.FullName.Replace($PSScriptRoot, "").TrimStart("\")
    $depth = ($relativePath.Split("\") | Where-Object { $_ -ne "" }).Count - 1
    
    if ($depth -le 0) {
        $relativePrefix = "./"
    } else {
        $relativePrefix = "../" * $depth
    }
    
    # Read the file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace absolute URLs with localhost
    $content = $content -replace 'http://127\.0\.0\.1:8003/', $relativePrefix
    
    # Replace absolute paths starting with / for resources
    $content = $content -replace 'href="/', "href=`"$relativePrefix"
    $content = $content -replace 'src="/', "src=`"$relativePrefix"
    $content = $content -replace 'content="/', "content=`"$relativePrefix"
    
    # Save the modified content back to the file
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Path conversion complete!" 