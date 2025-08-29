#!/usr/bin/env python3
"""
Insert concise, neutral block-level comments across all HTML files.

Rules:
- Comment top-level structural blocks: header, nav, main, section, article, aside, footer, and meaningful div/ul/ol containers
- Derive labels from id/class when helpful (e.g., section: services)
- Preserve indentation and whitespace
- Skip if a comment already precedes the block
- Skip vendor/backups/temp directories

Usage:
  python tools/annotate_html_blocks.py --dry-run
  python tools/annotate_html_blocks.py --apply
  python tools/annotate_html_blocks.py --backup-dir backup-html-blocks-YYYYMMDD-HHMMSS
"""

import argparse
import os
import re
import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_DIR_HINTS = (
    '.git', 'node_modules', 'backup-', 'backup_html', 'backup-html', 'temp',
    'fonts', 'videos'
)

BLOCK_TAGS = (
    'header', 'nav', 'main', 'section', 'article', 'aside', 'footer'
)

# Detect an opening tag we want to comment
TAG_RE = re.compile(r"^(?P<indent>\s*)<(?P<tag>header|nav|main|section|article|aside|footer)\b(?P<rest>[^>]*)>")
DIV_RE = re.compile(r"^(?P<indent>\s*)<(div)\b(?P<rest>[^>]*)>")
LIST_RE = re.compile(r"^(?P<indent>\s*)<(ul|ol)\b(?P<rest>[^>]*)>")

COMMENT_RE = re.compile(r"^\s*<!--.*-->")

def should_skip(dirpath: str) -> bool:
    lowered = dirpath.lower()
    return any(h in lowered for h in SKIP_DIR_HINTS)

def extract_hint(rest: str) -> str:
    """Extract a short hint from id/class attributes."""
    hint = None
    # id="something"
    m = re.search(r'id\s*=\s*"([^"]+)"', rest)
    if m:
        hint = m.group(1)
    else:
        # class="a b c" (prefer a meaningful one)
        m = re.search(r'class\s*=\s*"([^"]+)"', rest)
        if m:
            classes = m.group(1).strip().split()
            # Prefer known names
            for cand in classes:
                if any(key in cand for key in (
                    'main', 'navigation', 'nav', 'submenu', 'container', 'content', 'header', 'footer',
                    'hero', 'grid', 'section', 'wrap', 'wrapper', 'menu'
                )):
                    hint = cand
                    break
            if not hint and classes:
                hint = classes[0]
    if hint:
        # Normalize
        hint = hint.replace('-', ' ').replace('_', ' ').strip()
        hint = re.sub(r"\s+", " ", hint)
    return hint or ""

def make_comment(tag: str, rest: str) -> str:
    label = tag
    hint = extract_hint(rest)
    if hint:
        if tag == 'section':
            label = f"section: {hint}"
        elif tag == 'nav':
            label = f"navigation: {hint}"
        elif tag == 'div':
            label = f"container: {hint}"
        else:
            label = f"{tag}: {hint}"
    else:
        if tag == 'nav':
            label = "navigation"
    return f"<!-- {label} -->"

def annotate_html_blocks(path: Path) -> tuple[bool, str]:
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception as e:
        return False, f'read error: {e}'

    lines = text.splitlines()
    changed = False
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Skip if this line is already a comment
        if COMMENT_RE.match(line):
            out.append(line)
            i += 1
            continue

        m = TAG_RE.match(line)
        md = DIV_RE.match(line) if not m else None
        ml = LIST_RE.match(line) if not m and not md else None

        if m or md or ml:
            indent = (m or md or ml).group('indent')
            tag = (m.group('tag') if m else ('div' if md else 'list'))
            rest = (m or md or ml).group('rest')

            # Look back to find the previous non-empty line
            prev_idx = len(out) - 1
            while prev_idx >= 0 and out[prev_idx].strip() == '':
                prev_idx -= 1
            prev_is_comment = prev_idx >= 0 and COMMENT_RE.match(out[prev_idx] or '')

            if not prev_is_comment:
                label_tag = 'ul/ol' if tag == 'list' else tag
                out.append(f"{indent}{make_comment(label_tag, rest)}")
                changed = True

            out.append(line)
            i += 1
            continue

        out.append(line)
        i += 1

    new_text = "\n".join(out) + ("\n" if text.endswith("\n") else "")
    if new_text != text:
        return True, new_text
    return False, 'no changes'

def backup_files(files: list[Path], backup_root: Path) -> None:
    for p in files:
        dest = backup_root / p.relative_to(ROOT)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, dest)

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--backup-dir', default='')
    args = parser.parse_args()
    if not args.apply and not args.dry_run:
        args.dry_run = True

    # Gather HTML files
    html_files: list[Path] = []
    for dirpath, _, filenames in os.walk(ROOT):
        if should_skip(dirpath):
            continue
        for name in filenames:
            if name.lower().endswith('.html'):
                html_files.append(Path(dirpath) / name)

    backup_dir = None
    if args.apply:
        ts = datetime.now().strftime('%Y%m%d-%H%M%S')
        backup_dir_name = args.backup_dir or f'backup-html-blocks-{ts}'
        backup_dir = ROOT / backup_dir_name
        backup_files(html_files, backup_dir)

    scanned = 0
    changed_count = 0
    for p in html_files:
        scanned += 1
        did_change, result = annotate_html_blocks(p)
        if isinstance(result, str) and result not in ('no changes',):
            new_text = result
        else:
            new_text = None

        if did_change and new_text is not None and args.apply:
            p.write_text(new_text, encoding='utf-8')
        if did_change:
            changed_count += 1
        print(f"[{'CHANGE' if did_change else 'SKIP'}] {p.relative_to(ROOT)}")

    mode = 'APPLY' if args.apply else 'DRY-RUN'
    print(f"\n[{mode}] scanned={scanned} changed={changed_count}")
    if backup_dir is not None:
        print(f"[BACKUP] saved originals to {backup_dir}")

if __name__ == '__main__':
    main()


