$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$svgHref = '/assets/img/2025 photos/new logo 2025/Final Files/Button/Vector/Kansas Electric Button [CMYK].svg'

$files = Get-ChildItem -Recurse -Filter *.html | Where-Object { -not $_.FullName.Contains('backup-html') }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Replace any existing apple-touch-icon link with the SVG
    $content = [Regex]::Replace(
        $content,
        '<link[^>]+rel="apple-touch-icon"[^>]*>',
        '<link rel="apple-touch-icon" sizes="180x180" href="' + $svgHref + '">' ,
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    # Replace any existing generic favicon link with the SVG
    $content = [Regex]::Replace(
        $content,
        '<link[^>]+rel="(?:shortcut\s+icon|icon)"[^>]*>',
        '<link rel="icon" type="image/svg+xml" sizes="any" href="' + $svgHref + '">',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Favicons updated in $($files.Count) HTML files." -ForegroundColor Green


