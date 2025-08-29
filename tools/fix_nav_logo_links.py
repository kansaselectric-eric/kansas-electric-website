#!/usr/bin/env python3
"""
I ensure every `.kse-nav-logo` link points to the site root relative
to the page location. I set href to the computed prefix (./, ../, ../../, etc.).

Usage:
  python tools/fix_nav_logo_links.py --dry-run
  python tools/fix_nav_logo_links.py --apply
"""

import argparse
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LOGO_ANCHOR = re.compile(r'(<a\s+[^>]*class="[^"]*kse-nav-logo[^"]*"\s+href=")([^"]*)("[^>]*>)', re.IGNORECASE)

def rel_prefix(page: Path) -> str:
    rel = os.path.relpath(ROOT, page.parent).replace('\\', '/')
    if rel == '.':
        return './'
    if not rel.endswith('/'):
        rel += '/'
    return rel

def process_file(p: Path, apply: bool) -> tuple[bool, str]:
    html = p.read_text(encoding='utf-8', errors='ignore')
    prefix = rel_prefix(p)
    def repl(m):
        return f'{m.group(1)}{prefix}{m.group(3)}'
    new_html, n = LOGO_ANCHOR.subn(repl, html)
    if n and apply:
        p.write_text(new_html, encoding='utf-8')
    return bool(n), f'updated {n} logo link(s)' if n else 'no changes'

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

