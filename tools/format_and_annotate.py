#!/usr/bin/env python3
"""
I add small, first-person header comments to source files and clean up
excess blank lines. I keep it light, informal, and safe.

Rules:
- Collapse 3+ consecutive blank lines to a single blank line
- Skip vendor assets (fancybox, fonts, videos) and backups
- Add a short header comment if the file has no top-of-file comment
  (JS/CSS/PY/PS1/BAT only). HTML gets whitespace cleanup only.

Usage:
  python tools/format_and_annotate.py --dry-run
  python tools/format_and_annotate.py --apply
"""

import argparse
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_DIR_HINTS = (
    '.git', 'node_modules', 'backup-', 'backup_html', 'backup-html', 'temp',
    'fonts', 'videos'
)

SKIP_VENDOR_PATTERNS = (
    'fancybox',
)

HEADER_MAP = {
    'navigation-unified.js': "// I centralize desktop/mobile nav so I don't fight scripts across pages.\n",
    'reveal.js': "// I handle simple image fade-ins and scroll reveals without a dependency.\n",
    'mobile-nav.css': "/* I keep mobile nav styles here so I can turn features on/off safely. */\n",
    'main.css': "/* I consolidate utilities and a few house styles; I stick to readable overrides. */\n",
}

GENERIC_HEADERS = {
    '.js': "// I keep this file focused and small; if it grows, I split modules.\n",
    '.css': "/* I keep these styles predictable and scoped; shout if you see drift. */\n",
    '.py': "# I wrote this helper so I can maintain pages safely and repeatably.\n",
    '.ps1': "# I use this script to automate repetitive tasks; no manual edits needed.\n",
    '.bat': ":: I keep this tiny batch as a convenience runner.\n",
}

TOP_COMMENT_DETECT = {
    '.js': re.compile(r"^\s*(/\*|//)"),
    '.css': re.compile(r"^\s*/\*"),
    '.py': re.compile(r"^\s*#"),
    '.ps1': re.compile(r"^\s*#"),
    '.bat': re.compile(r"^\s*::"),
}


def collapse_blank_lines(text: str) -> str:
    # Replace 3+ blank lines with a single blank line
    return re.sub(r"(\n\s*){3,}", "\n\n", text)


def add_header_if_needed(path: Path, text: str) -> str:
    ext = path.suffix.lower()
    if ext not in TOP_COMMENT_DETECT:
        return text
    # Skip vendor patterns
    lowered = str(path).lower()
    if any(pat in lowered for pat in SKIP_VENDOR_PATTERNS):
        return text
    if TOP_COMMENT_DETECT[ext].search(text):
        return text  # already has a comment at the top
    header = HEADER_MAP.get(path.name) or GENERIC_HEADERS.get(ext)
    if not header:
        return text
    return header + text


def should_skip(dirpath: str) -> bool:
    return any(h in dirpath for h in SKIP_DIR_HINTS)


def process_file(p: Path, apply: bool) -> tuple[bool, str]:
    original = p.read_text(encoding='utf-8', errors='ignore')
    new_text = collapse_blank_lines(original)
    new_text = add_header_if_needed(p, new_text)
    changed = new_text != original
    if changed and apply:
        p.write_text(new_text, encoding='utf-8')
    return changed, 'formatted + annotated' if changed else 'no changes'


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    if not args.apply and not args.dry_run:
        args.dry_run = True

    exts = {'.js', '.css', '.py', '.ps1', '.bat', '.html'}
    scanned = 0
    changed = 0
    for dirpath, _, filenames in os.walk(ROOT):
        if should_skip(dirpath):
            continue
        for name in filenames:
            if Path(name).suffix.lower() not in exts:
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


