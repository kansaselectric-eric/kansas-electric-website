# I use this script to automate repetitive tasks; no manual edits needed.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$brand = '#00458C'

$files = Get-ChildItem -Recurse -Filter *.html | Where-Object { $_.FullName -notmatch 'backup-html' }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Update any footer-custom background color tokens
    $content = [Regex]::Replace($content,'background-color:\s*#0056D2','background-color: ' + $brand,[System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    # Update inline CTA blues often used near footer
    $content = [Regex]::Replace($content,'#0047b3','#00386F',[System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $content = [Regex]::Replace($content,'#0056D2',$brand,[System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    # For gray footers, enforce brand background via inline style and ensure text-white
    $content = [Regex]::Replace(
        $content,
        '<footer\s+class="([^"]*?)bg-ke-gray-dark([^"]*?)"\s*>',
        { param($m)
            $classes = ($m.Groups[1].Value + ' bg-ke-gray-dark ' + $m.Groups[2].Value).Trim()
            if ($classes -notmatch '(?i)text-white') { $classes = ($classes.Trim() + ' text-white').Trim() }
            return '<footer class="' + $classes.Trim() + '" style="background-color:' + $brand + '">'
        },
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Footers updated in $($files.Count) HTML files to $brand." -ForegroundColor Green

