#!/usr/bin/env python3
"""
I use this to swap all per-page navigation script includes to a single
unified script at assets/js/navigation-unified.js. I preserve 'defer'
and do not touch jQuery or other unrelated scripts.

What I replace:
- assets/js/navigation-fixed.js
- projects/.../redesigned-navigation.js
- projects/.../s-tier-navigation.js
- projects/.../(mobile-hamburger|mobile-nav-overhaul).js
- projects/.../division-nav-*.js

I insert the unified script before </body> if not present.

Usage:
  python tools/swap_navigation_js.py --dry-run
  python tools/swap_navigation_js.py --apply
"""

import argparse
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UNIFIED_REL = 'assets/js/navigation-unified.js'

PATTERNS = [
    r'<script[^>]+assets/js/navigation-fixed\.js[^>]*></script>\s*',
    r'<script[^>]+projects/[^>]+/redesigned-navigation\.js[^>]*></script>\s*',
    r'<script[^>]+projects/[^>]+/s-tier-navigation\.js[^>]*></script>\s*',
    r'<script[^>]+projects/[^>]+/mobile-hamburger\.js[^>]*></script>\s*',
    r'<script[^>]+projects/[^>]+/mobile-nav-overhaul\.js[^>]*></script>\s*',
    r'<script[^>]+projects/[^>]+/division-nav-(?:links|direct|fix)\.js[^>]*></script>\s*',
]

def rel_from(file_path: Path, target: Path) -> str:
    rel = os.path.relpath(target, file_path.parent)
    rel = rel.replace('\\', '/')
    if not rel.startswith('.') and not rel.startswith('/'):
        rel = './' + rel
    return rel

def process_file(path: Path, apply: bool) -> tuple[bool, str]:
    original = path.read_text(encoding='utf-8', errors='ignore')
    html = original
    removed = 0
    for pat in PATTERNS:
        new_html, n = re.subn(pat, '', html, flags=re.IGNORECASE)
        if n:
            removed += n
            html = new_html

    # If we removed any, ensure unified is present near the end of body
    summary = []
    if removed:
        summary.append(f'removed {removed} nav script include(s)')
        unified_src = rel_from(path, ROOT / UNIFIED_REL)
        if unified_src not in html:
            tag = f'  <script src="{unified_src}" defer></script>'
            m = re.search(r'</body>', html, re.IGNORECASE)
            if m:
                html = html[:m.start()] + tag + '\n' + html[m.start():]
            else:
                html = html + '\n' + tag + '\n'
            summary.append('added navigation-unified.js')

    if html != original and apply:
        path.write_text(html, encoding='utf-8')

    changed = html != original
    return changed, '; '.join(summary) if summary else 'no changes'

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    if not args.apply and not args.dry_run:
        args.dry_run = True

    scanned = 0
    changed = 0
    for dirpath, _, filenames in os.walk(ROOT):
        if any(seg in dirpath for seg in ['.git', 'node_modules', 'backup-', 'backup_html', 'backup-html', 'temp']):
            continue
        for name in filenames:
            if not name.lower().endswith('.html'):
                continue
            p = Path(dirpath) / name
            scanned += 1
            did_change, info = process_file(p, apply=args.apply)
            if did_change:
                changed += 1
            print(f'[{"CHANGE" if did_change else "SKIP"}] {p.relative_to(ROOT)} -> {info}')
    mode = 'APPLY' if args.apply else 'DRY-RUN'
    print(f'\n[{mode}] scanned={scanned} changed={changed}')

if __name__ == '__main__':
    main()

