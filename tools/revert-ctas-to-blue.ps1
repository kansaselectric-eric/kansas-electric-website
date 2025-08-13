Param()

$ErrorActionPreference = 'Stop'

function Revert-CTAColors {
	param([string]$Path)
	$original = Get-Content -LiteralPath $Path -Raw
	$content = $original

	# CSS class definitions
	$content = $content -replace 'background-color:\s*#F7941E', 'background-color: #0056D2'
	$content = $content -replace 'background-color:\s*#e8851a', 'background-color: #0047b3'
	$content = $content -replace 'rgba\(247,\s*148,\s*30,\s*0\.3\)', 'rgba(0, 86, 210, 0.3)'

	# Inline CTA button styles
	$content = $content -replace 'style="([^"]*?)background-color:\s*#F7941E;?([^"]*?)"', 'style="$1background-color: #0056D2;$2"'
    $content = $content -replace 'onmouseover="this\.style\.backgroundColor=''#?e8851a''"', 'onmouseover="this.style.backgroundColor=''#0047b3''"'
    $content = $content -replace 'onmouseout="this\.style\.backgroundColor=''#?F7941E''"', 'onmouseout="this.style.backgroundColor=''#0056D2''"'

	if ($content -ne $original) { Set-Content -LiteralPath $Path -Value $content -Encoding UTF8; return $true }
	return $false
}

$root = Resolve-Path (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location (Resolve-Path (Join-Path $root '..'))

$updated = 0
Get-ChildItem -Recurse -File -Filter '*.html' | ForEach-Object {
	if (Revert-CTAColors -Path $_.FullName) { $updated++ }
}

Write-Host ("CTA color reverts applied to {0} files." -f $updated)


