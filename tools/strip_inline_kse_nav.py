#!/usr/bin/env python3
"""
I remove inline KSE navigation JS blocks now that the unified script
implements the same behavior. I only remove <script> blocks that clearly
target kse-nav/kse-dropdown logic. I do not touch jQuery or other scripts.

Usage:
  python tools/strip_inline_kse_nav.py --dry-run
  python tools/strip_inline_kse_nav.py --apply
"""

import argparse
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Heuristic: script blocks containing references to .kse-nav-item/.kse-dropdown/.kse-nav
KSE_JS_BLOCK = re.compile(
    r'<script[^>]*>[^<]*(?:kse-nav-item|kse-dropdown|kse-nav)[\s\S]*?</script>',
    re.IGNORECASE
)


def process_file(path: Path, apply: bool) -> tuple[bool, str]:
    original = path.read_text(encoding='utf-8', errors='ignore')
    html = original
    new_html, n = KSE_JS_BLOCK.subn('', html)
    if n and apply:
        path.write_text(new_html, encoding='utf-8')
    return new_html != html, f'removed {n} inline KSE nav script block(s)' if n else 'no changes'


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


