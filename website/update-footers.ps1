# I use this script to automate repetitive tasks; no manual edits needed.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$brand = '#00458C'

$files = Get-ChildItem -Recurse -Filter *.html | Where-Object { $_.FullName -notmatch 'backup-html' }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # 1) Update any footer-custom background color tokens
    $content = $content -replace '(?i)background-color:\s*#0056D2', 'background-color: ' + $brand
    $content = $content -replace '(?i)background-color:\s*#0056d2', 'background-color: ' + $brand

    # 2) Update any CTA inline blues commonly used in footers
    $content = $content -replace '(?i)#0047b3', '#00386F'
    $content = $content -replace '(?i)#0056D2', $brand

    # 3) For gray footers, add inline background and ensure text is white
    $content = [Regex]::Replace(
        $content,
        '<footer\s+class="([^"]*?)bg-ke-gray-dark([^"]*?)"\s*>',
        { param($m)
            $classes = $m.Groups[1].Value + 'bg-ke-gray-dark' + $m.Groups[2].Value
            if ($classes -notmatch '(?i)text-white') { $classes = ($classes.Trim() + ' text-white').Trim() }
            return '<footer class="' + $classes.Trim() + '" style="background-color:' + $brand + '">'
        },
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Footers updated in $($files.Count) HTML files." -ForegroundColor Green

