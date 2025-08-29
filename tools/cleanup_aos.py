#!/usr/bin/env python3
"""
I use this script to remove AOS from HTML files and insert my lightweight
reveal + mobile nav assets without breaking layout. I make backups first.

What I do per HTML file:
- Remove any <link> or <script> that references unpkg AOS
- Remove inline <script> blocks that call AOS.init(...)
- Ensure a stylesheet link to assets/css/mobile-nav.css is present
- Ensure a defer script to assets/js/reveal.js is present

Usage:
  python tools/cleanup_aos.py --dry-run   # show planned changes
  python tools/cleanup_aos.py --apply     # write changes (creates backup)
"""

import argparse
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def rel_from(file_path: Path, target: Path) -> str:
    rel = os.path.relpath(target, file_path.parent)
    rel = rel.replace('\\', '/')
    if not rel.startswith('.') and not rel.startswith('/'):
        rel = './' + rel
    return rel

def ensure_mobile_css(html: str, file_path: Path) -> tuple[str, bool]:
    css_href = rel_from(file_path, ROOT / 'assets/css/mobile-nav.css')
    if css_href in html:
        return html, False

    # Insert after main.css if found, else before closing head
    link_tag = f'  <link rel="stylesheet" href="{css_href}">'
    main_css_match = re.search(r'<link[^>]+assets/css/main\.css[^>]*>', html, re.IGNORECASE)
    if main_css_match:
        insert_at = main_css_match.end()
        html = html[:insert_at] + '\n' + link_tag + html[insert_at:]
        return html, True

    head_close = re.search(r'</head>', html, re.IGNORECASE)
    if head_close:
        insert_at = head_close.start()
        html = html[:insert_at] + link_tag + '\n' + html[insert_at:]
        return html, True

    return html, False

def ensure_reveal_js(html: str, file_path: Path) -> tuple[str, bool]:
    js_src = rel_from(file_path, ROOT / 'assets/js/reveal.js')
    if js_src in html:
        return html, False

    script_tag = f'  <script src="{js_src}" defer></script>'
    body_close = re.search(r'</body>', html, re.IGNORECASE)
    if body_close:
        insert_at = body_close.start()
        html = html[:insert_at] + script_tag + '\n' + html[insert_at:]
        return html, True

    # Fallback: end of file
    return html + '\n' + script_tag + '\n', True

def remove_aos(html: str) -> tuple[str, int]:
    changes = 0
    # Remove AOS CSS/JS includes
    patterns = [
        r'<link[^>]+aos[^>]*>\s*',
        r'<script[^>]+aos[^>]*></script>\s*',
        r'<script[^>]+aos[^>]*></script>\s*',
    ]
    for pat in patterns:
        new_html, n = re.subn(pat, '', html, flags=re.IGNORECASE)
        if n:
            changes += n
            html = new_html

    # Remove inline AOS.init script blocks
    inline_pat = re.compile(r'<script[^>]*>[^<]*AOS\s*\.\s*init\([^<]*</script>', re.IGNORECASE | re.DOTALL)
    new_html, n = inline_pat.subn('', html)
    if n:
        changes += n
        html = new_html

    return html, changes

def process_file(path: Path, apply: bool) -> tuple[bool, str]:
    original = path.read_text(encoding='utf-8', errors='ignore')
    html = original
    summary = []

    html, removed_count = remove_aos(html)
    if removed_count:
        summary.append(f'removed {removed_count} AOS include/init blocks')

    html, added_css = ensure_mobile_css(html, path)
    if added_css:
        summary.append('added mobile-nav.css')

    html, added_js = ensure_reveal_js(html, path)
    if added_js:
        summary.append('added reveal.js')

    if html != original and apply:
        # Backup once per run at the file level
        backup_root = ROOT / f'backup-html-aos-clean-{os.environ.get("USERNAME", "user")}'
        backup_file = backup_root / path.relative_to(ROOT)
        backup_file.parent.mkdir(parents=True, exist_ok=True)
        if not backup_file.exists():
            backup_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, backup_file)

        path.write_text(html, encoding='utf-8')

    return html != original, '; '.join(summary) if summary else 'no changes'

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true', help='write changes to disk')
    parser.add_argument('--dry-run', action='store_true', help='show planned changes only')
    args = parser.parse_args()

    if not args.apply and not args.dry_run:
        args.dry_run = True

    changed = 0
    scanned = 0

    for dirpath, _, filenames in os.walk(ROOT):
        # Skip backup, node_modules, .git, temp tools
        if any(seg in dirpath for seg in ['.git', 'node_modules', 'backup-', 'backup_html', 'backup-html', 'temp']):
            continue
        for name in filenames:
            if not name.lower().endswith('.html'):
                continue
            file_path = Path(dirpath) / name
            scanned += 1
            did_change, info = process_file(file_path, apply=args.apply)
            if did_change:
                changed += 1
            print(f'[{"CHANGE" if did_change else "SKIP"}] {file_path.relative_to(ROOT)} -> {info}')

    mode = 'APPLY' if args.apply else 'DRY-RUN'
    print(f'\n[{mode}] scanned={scanned} changed={changed}')

if __name__ == '__main__':
    main()

