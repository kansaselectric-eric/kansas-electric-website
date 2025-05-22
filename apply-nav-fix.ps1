# Navigation Menu Fix - applies to all HTML files in the website
# This adds our nav-fix.js script to all HTML files

$baseDir = $PSScriptRoot
$modifiedCount = 0

# Create backup directory if it doesn't exist
$backupDir = Join-Path $baseDir "backup-html-nav-fix-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if (-not (Test-Path $backupDir)) {
    New-Item -Path $backupDir -ItemType Directory | Out-Null
    Write-Host "Created backup directory: $backupDir"
}

# Get all HTML files in the current directory and subdirectories
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -Recurse -Include "*.html" | 
    Where-Object { $_.FullName -notlike "*\backup*" }

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.FullName)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Check if the file already has the nav-fix script
    if ($content -match "nav-fix.js") {
        Write-Host "  - Already has nav-fix.js, skipping..."
        continue
    }
    
    # Create a backup of the file
    $relativePath = $file.FullName.Substring($baseDir.Length + 1)
    $backupPath = Join-Path $backupDir $relativePath
    $backupDir = Split-Path -Path $backupPath -Parent
    if (-not (Test-Path $backupDir)) {
        New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
    }
    Copy-Item -Path $file.FullName -Destination $backupPath
    
    # Determine the relative path to the assets directory
    $relativePath = $file.Directory.FullName.Substring($baseDir.Length)
    $relativePath = $relativePath -replace '\\', '/'
    $depth = ($relativePath -split '/').Length - 1
    $assetsPath = if ($depth -eq 0) {
        "./assets/js/nav-fix.js"
    } else {
        "../" * $depth + "assets/js/nav-fix.js"
    }
    
    # Add the script tag before the closing </body> tag
    $navFixScript = "`n<!-- Navigation hover fix script -->`n<script src=`"$assetsPath`"></script>`n"
    $content = $content -replace "</body>", "$navFixScript</body>"
    
    # Save the file if modified
    if ($content -ne $originalContent) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        $modifiedCount++
        Write-Host "  - Updated with nav-fix.js script"
    }
}

Write-Host "Applied navigation fix to $modifiedCount HTML files. Backups stored in $backupDir" 