#!/usr/bin/env python3
"""
Remove the scrolling ticker from HTML/CSS/JS across the site without touching unrelated features.

What gets removed:
- HTML blocks containing classes: ticker-container, ticker-wrapper, ticker-scroll, ticker-item
- Inline <style> rules that target .ticker-* and @keyframes ticker
- <script> blocks that reference '.ticker-scroll'
- CSS rules in standalone stylesheets that target .ticker-*

Files skipped: backups, vendor, temp, node_modules, .git

Usage:
  python tools/remove_ticker.py --dry-run
  python tools/remove_ticker.py --apply
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

TICKER_CLASS_SNIPPETS = (
    'ticker-container', 'ticker-wrapper', 'ticker-scroll', 'ticker-item'
)

def should_skip_dir(dirpath: str) -> bool:
    lp = dirpath.lower()
    return any(h in lp for h in SKIP_DIR_HINTS)

def backup_paths(paths: list[Path], backup_root: Path) -> None:
    for p in paths:
        dest = backup_root / p.relative_to(ROOT)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, dest)

def remove_div_block(text: str, start_idx: int) -> tuple[str, bool]:
    """Remove a <div ...> ... </div> block starting at start_idx by balancing <div> tags.
    Returns (new_text, changed).
    """
    open_tag_pos = text.find('<div', start_idx)
    if open_tag_pos == -1 or open_tag_pos != start_idx:
        return text, False
    # Find end of opening tag
    open_tag_end = text.find('>', open_tag_pos)
    if open_tag_end == -1:
        return text, False
    i = open_tag_end + 1
    depth = 1
    while i < len(text):
        next_open = text.find('<div', i)
        next_close = text.find('</div>', i)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            i = next_open + 4
            continue
        depth -= 1
        i = next_close + len('</div>')
        if depth == 0:
            # remove range [open_tag_pos, i)
            return text[:open_tag_pos] + text[i:], True
    return text, False

STYLE_TICKER_RULES = re.compile(r"(?ms)\.[A-Za-z0-9_-]*ticker[A-Za-z0-9_-]*[^\{]*\{[^\}]*\}")
STYLE_KEYFRAMES = re.compile(r"(?ms)@(?:-webkit-|-moz-)?keyframes\s+ticker\s*\{[^\}]*\}")

def strip_ticker_in_style_block(style_content: str) -> tuple[str, bool]:
    changed = False
    new_content, n1 = STYLE_TICKER_RULES.subn('', style_content)
    if n1:
        changed = True
    newer_content, n2 = STYLE_KEYFRAMES.subn('', new_content)
    if n2:
        changed = True
    # Collapse extra blank lines
    newer_content = re.sub(r"\n{3,}", "\n\n", newer_content)
    return newer_content, changed

SCRIPT_TICKER = re.compile(r"(?is)<script[^>]*>.*?ticker-scroll.*?</script>")

def process_html(p: Path) -> tuple[bool, str]:
    try:
        text = p.read_text(encoding='utf-8', errors='ignore')
    except Exception as e:
        return False, f'read error: {e}'

    original = text
    changed = False

    # Remove ticker container blocks by locating the container divs
    search_pos = 0
    while True:
        idx = -1
        for cls in ('ticker-container',):
            idx = text.find(f'class="', search_pos)
            if idx == -1:
                break
            # Cheap scan forward to see if this opening div has the target class
            open_div = text.rfind('<div', search_pos, idx)
            if open_div == -1:
                search_pos = idx + 7
                continue
            tag_end = text.find('>', open_div)
            if tag_end == -1:
                break
            seg = text[open_div:tag_end]
            if 'ticker-container' in seg:
                # remove from open_div
                text, removed = remove_div_block(text, open_div)
                changed = changed or removed
                search_pos = open_div
            else:
                search_pos = idx + 7
        if idx == -1:
            break

    # Remove script blocks that reference ticker-scroll entirely
    text2, n_scripts = SCRIPT_TICKER.subn('', text)
    if n_scripts:
        text = text2
        changed = True

    # Process <style> blocks: strip .ticker* rules and keyframes
    out = []
    i = 0
    lines = text.splitlines()
    in_style = False
    style_buf = []
    for line in lines:
        if not in_style and re.search(r"<style[^>]*>", line, re.I):
            in_style = True
            style_buf = [line]
            continue
        if in_style:
            style_buf.append(line)
            if re.search(r"</style>", line, re.I):
                in_style = False
                style_text = "\n".join(style_buf)
                m = re.search(r"(?is)<style[^>]*>(.*)</style>", style_text)
                if m:
                    inner = m.group(1)
                    stripped, st_changed = strip_ticker_in_style_block(inner)
                    if st_changed:
                        changed = True
                    rebuilt = re.sub(r"(?is)<style[^>]*>.*</style>", f"<style>\n{stripped}\n</style>", style_text)
                    out.append(rebuilt)
                else:
                    out.append(style_text)
                style_buf = []
            continue
        out.append(line)
    if style_buf:
        out.extend(style_buf)
    new_text = "\n".join(out)

    if new_text != original:
        return True, new_text
    return False, original

CSS_RULE_BLOCK = re.compile(r"(?ms)\n\s*\.(?:ticker-[A-Za-z0-9_-]+)\s*\{[^\}]*\}")

def process_css(p: Path) -> tuple[bool, str]:
    try:
        text = p.read_text(encoding='utf-8', errors='ignore')
    except Exception as e:
        return False, f'read error: {e}'
    original = text
    # Remove any .ticker-* rule blocks
    text2, n1 = CSS_RULE_BLOCK.subn('', text)
    # Also remove any scattered single-line occurrences (defensive)
    text3 = re.sub(r"\n\s*\.(?:ticker-[A-Za-z0-9_-]+)\s*;?\s*\n", "\n", text2)
    # Remove keyframes named ticker if present
    text4, n2 = STYLE_KEYFRAMES.subn('', text3)
    changed = (text4 != original)
    return changed, text4

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    if not args.apply and not args.dry_run:
        args.dry_run = True

    html_files = []
    css_files = []

    for dirpath, _, filenames in os.walk(ROOT):
        if should_skip_dir(dirpath):
            continue
        for name in filenames:
            lp = name.lower()
            if lp.endswith('.html'):
                html_files.append(Path(dirpath) / name)
            elif lp.endswith('.css'):
                css_files.append(Path(dirpath) / name)

    # Specific CSS file to delete if present
    ticker_css = ROOT / 'projects' / 'stanley-black-decker' / 'ticker-styles.css'

    # Backup
    ts = datetime.now().strftime('%Y%m%d-%H%M%S')
    backup_dir = ROOT / f'backup-ticker-{ts}'
    if args.apply:
        backup_list = [*html_files, *css_files]
        if ticker_css.exists():
            backup_list.append(ticker_css)
        backup_paths(backup_list, backup_dir)

    scanned = 0
    changed_html = 0
    for p in html_files:
        scanned += 1
        did_change, result = process_html(p)
        if did_change and args.apply:
            p.write_text(result, encoding='utf-8')
            changed_html += 1
        print(f"[{'CHANGE' if did_change else 'SKIP'}] HTML {p.relative_to(ROOT)}")

    changed_css = 0
    for p in css_files:
        # Only process CSS that actually contains ticker classes quickly
        try:
            txt = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        if '.ticker-' not in txt and '@keyframes ticker' not in txt:
            continue
        did_change, new_txt = process_css(p)
        if did_change and args.apply:
            p.write_text(new_txt, encoding='utf-8')
            changed_css += 1
        print(f"[{'CHANGE' if did_change else 'SKIP'}] CSS {p.relative_to(ROOT)}")

    deleted = False
    if ticker_css.exists() and args.apply:
        try:
            ticker_css.unlink()
            deleted = True
            print(f"[DELETE] {ticker_css.relative_to(ROOT)}")
        except Exception as e:
            print(f"[WARN] could not delete {ticker_css}: {e}")

    mode = 'APPLY' if args.apply else 'DRY-RUN'
    print(f"\n[{mode}] html_changed={changed_html} css_changed={changed_css} deleted_file={deleted} backup={backup_dir if args.apply else 'n/a'}")

if __name__ == '__main__':
    main()


