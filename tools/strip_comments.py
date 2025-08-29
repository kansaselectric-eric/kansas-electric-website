#!/usr/bin/env python3
"""
I remove unnecessary HTML comments across the codebase.
Safeguards:
- I skip conditional comments like <!--[if ...]> and <![endif]-->
- I only touch .html files

Usage:
  python tools/strip_comments.py --dry-run
  python tools/strip_comments.py --apply
"""

import argparse
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Matches standard HTML comments, excluding IE conditionals
COMMENT_PATTERN = re.compile(r'<!--(?!\[if|\s*<!)[\s\S]*?-->', re.IGNORECASE)

def strip_comments(text: str) -> tuple[str, int]:
    new_text, n = COMMENT_PATTERN.subn('', text)
    return new_text, n

def process_file(path: Path, apply: bool) -> tuple[bool, str]:
    original = path.read_text(encoding='utf-8', errors='ignore')
    new_text, n = strip_comments(original)
    if n and apply:
        path.write_text(new_text, encoding='utf-8')
    return new_text != original, f'removed {n} comment(s)' if n else 'no changes'

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

