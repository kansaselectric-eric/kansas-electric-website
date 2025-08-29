# I use this script to automate repetitive tasks; no manual edits needed.
Param()

$ErrorActionPreference = 'Stop'

function Update-FileContent {
	param(
		[string]$Path
	)
	$original = Get-Content -LiteralPath $Path -Raw
	$content = $original

    # Replace absolute mobile overlay logo with Button SVG
    $content = $content -replace '/assets/img/kse-logo\.png', '/assets/img/2025 photos/new logo 2025/Final Files/Button/Vector/Kansas Electric Button [CMYK].svg'

    # Replace kansas-electric-logo-color.svg with new CMYK vector logo across all path styles
    # 1) Preserve ../ depth
    $patternDepth = '((?:\.\.\/)+)assets\/img\/kansas-electric-logo-color\.svg'
    $replacement = '$1assets/img/2025 photos/new logo 2025/Final Files/Vector/Kansas Electric [CMYK].svg'
    $content = [regex]::Replace($content, $patternDepth, $replacement)

    # 2) ./ relative
    $content = $content -replace '\./assets/img/kansas-electric-logo-color\.svg', './assets/img/2025 photos/new logo 2025/Final Files/Vector/Kansas Electric [CMYK].svg'

    # 3) Root absolute
    $content = $content -replace '/assets/img/kansas-electric-logo-color\.svg', '/assets/img/2025 photos/new logo 2025/Final Files/Vector/Kansas Electric [CMYK].svg'

    # 4) Full absolute URL in JSON-LD or meta
    $content = $content -replace 'https://www\.kansaselectric\.com/assets/img/kansas-electric-logo-color\.svg', 'https://www.kansaselectric.com/assets/img/2025 photos/new logo 2025/Final Files/Vector/Kansas Electric [CMYK].svg'

	# Brand color updates to match supplier page
	$content = $content -replace '#2563eb', '#F7941E'   # link hover
	$content = $content -replace '#0056D2', '#F7941E'   # CTA bg
	$content = $content -replace '#0047b3', '#e8851a'   # CTA hover
	$content = $content -replace 'rgba\(0, 86, 210, 0\.3\)', 'rgba(247, 148, 30, 0.3)'

	if ($content -ne $original) {
		Set-Content -LiteralPath $Path -Value $content -Encoding UTF8
		return $true
	}
	return $false
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $root '..')
Set-Location $projectRoot

$files = Get-ChildItem -Recurse -File -Filter '*.html'
$updated = 0
foreach ($f in $files) {
	if (Update-FileContent -Path $f.FullName) { $updated++ }
}

Write-Host ("Updated {0} files." -f $updated)

