#!/usr/bin/env python3
"""
I unify the mobile nav across all pages to match the Oil & Gas page.

What I do per HTML file:
- Remove any existing elements with ids: mobileMenuTrigger, mobileNavOverlay,
  mobileNavBackdrop, mobileNavClose, and the .mobile-top-bar block
- Inject a standardized minimal mobile nav right after <body>
- All links are built using a computed relative prefix to the site root

Usage:
  python tools/unify_mobile_nav.py --dry-run
  python tools/unify_mobile_nav.py --apply
"""

import argparse
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def rel_prefix(page: Path) -> str:
    rel = os.path.relpath(ROOT, page.parent).replace('\\', '/')
    if rel == '.':
        return './'
    if not rel.endswith('/'):
        rel += '/'
    return rel


def build_mobile_nav(prefix: str) -> str:
    # MENU trigger + backdrop + overlay with core sections; sticky CTA preserved
    return f'''
  <div class="mobile-top-bar md:hidden flex justify-center items-center h-20 bg-white border-b border-gray-200 shadow-sm">
    <img src="{prefix}assets/img/2025 photos/new logo 2025/Final Files/Vector/Kansas Electric [CMYK].svg"
         alt="Kansas Electric" class="h-10 w-auto object-contain mx-auto" loading="lazy">
  </div>

  <div class="mobile-menu-trigger" id="mobileMenuTrigger">MENU</div>

  <div class="mobile-nav-backdrop md:hidden" id="mobileNavBackdrop"></div>

  <nav class="mobile-nav-overlay md:hidden" id="mobileNavOverlay">
    <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close mobile menu">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <div class="mobile-nav-content pb-32">
      <a href="{prefix}" class="block w-full px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-sm hover:bg-gray-50 transition text-center">Home</a>
      <div class="relative z-10 border-t border-gray-200"></div>
      <div>
        <button class="flex justify-between items-center w-full px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-sm hover:bg-gray-50 transition" onclick="toggleMobileDropdown('servicesMenu')">
          <span>Services</span>
        </button>
        <div id="servicesMenu" class="hidden flex flex-col space-y-1 pt-1 pb-1 bg-white shadow-md rounded-md border border-gray-100 mx-4 my-2">
          <a href="{prefix}services/divisions/industrial/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5">
            <div class="text-sm font-medium text-gray-900">Industrial Electrical</div>
            <div class="text-xs text-gray-500">Heavy infrastructure & power systems</div>
          </a>
          <a href="{prefix}services/divisions/commercial/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5">
            <div class="text-sm font-medium text-gray-900">Commercial Electrical</div>
            <div class="text-xs text-gray-500">Office buildings & retail spaces</div>
          </a>
          <a href="{prefix}services/divisions/service-maintenance/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5">
            <div class="text-sm font-medium text-gray-900">Service & Maintenance</div>
            <div class="text-xs text-gray-500">24/7 support & preventive care</div>
          </a>
          <a href="{prefix}services/divisions/automation-control/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5">
            <div class="text-sm font-medium text-gray-900">Automation & Control Systems</div>
            <div class="text-xs text-gray-500">Smart systems & process control</div>
          </a>
        </div>
      </div>
      <div class="relative z-10 border-t border-gray-200"></div>
      <div>
        <button class="flex justify-between items-center w-full px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-sm hover:bg-gray-50 transition" onclick="toggleMobileDropdown('industriesMenu')">
          <span>Industries We Serve</span>
        </button>
        <div id="industriesMenu" class="hidden flex flex-col space-y-1 pt-1 pb-1 bg-white shadow-md rounded-md border border-gray-100 mx-4 my-2">
          <a href="{prefix}services/industrial/oil-gas/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5"><div class="text-sm font-medium text-gray-900">Oil & Gas</div><div class="text-xs text-gray-500">Refineries & pipelines</div></a>
          <a href="{prefix}services/industrial/wastewater-treatment/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5"><div class="text-sm font-medium text-gray-900">Water and Wastewater</div><div class="text-xs text-gray-500">Treatment facilities</div></a>
          <a href="{prefix}services/industrial/data-centers/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5"><div class="text-sm font-medium text-gray-900">Data Centers</div><div class="text-xs text-gray-500">Mission critical facilities</div></a>
          <a href="{prefix}services/industrial/advanced-manufacturing/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5"><div class="text-sm font-medium text-gray-900">Manufacturing</div><div class="text-xs text-gray-500">Production facilities</div></a>
          <a href="{prefix}services/industrial/food-beverage/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5"><div class="text-sm font-medium text-gray-900">Food & Beverage</div><div class="text-xs text-gray-500">Processing plants</div></a>
          <a href="{prefix}services/industrial/healthcare/" class="block w-full px-6 py-2 text-left border-b border-gray-100 hover:bg-gray-50 flex flex-col gap-0.5"><div class="text-sm font-medium text-gray-900">Healthcare Infrastructure</div><div class="text-xs text-gray-500">Critical care facilities</div></a>
        </div>
      </div>
      <div class="relative z-10 border-t border-gray-200"></div>
      <button class="flex justify-between items-center w-full px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-sm hover:bg-gray-50 transition" onclick="window.location.href='{prefix}projects/'"><span>Projects</span></button>
      <div class="relative z-10 border-t border-gray-200"></div>
      <button class="flex justify-between items-center w-full px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-sm hover:bg-gray-50 transition" onclick="window.location.href='{prefix}about/'"><span>About</span></button>
      <div class="relative z-10 border-t border-gray-200"></div>
      <button class="flex justify-between items-center w-full px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-sm hover:bg-gray-50 transition" onclick="window.location.href='{prefix}careers/'"><span>Careers</span></button>
      <div class="px-6 pt-6 pb-10">
        <a href="{prefix}request-a-quote/" class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition">Let's Engineer Your Next Power Move</a>
      </div>
    </div>
  </nav>
    '''


REMOVE_BLOCK = re.compile(
    r"\s*(<div[^>]+id=\"mobileMenuTrigger\"[\s\S]*?</div>|"
    r"<nav[^>]+id=\"mobileNavOverlay\"[\s\S]*?</nav>|"
    r"<div[^>]+id=\"mobileNavBackdrop\"[\s\S]*?</div>|"
    r"<button[^>]+id=\"mobileNavClose\"[\s\S]*?</button>|"
    r"<div[^>]+class=\"mobile-top-bar[\s\S]*?</div>)",
    re.IGNORECASE
)


def process_file(path: Path, apply: bool) -> tuple[bool, str]:
    html = path.read_text(encoding='utf-8', errors='ignore')
    # Skip if this already looks unified
    if all(k in html for k in ("mobileMenuTrigger", "mobileNavOverlay", "mobileNavBackdrop")):
        return False, 'already unified'

    # Remove any previous mobile blocks
    cleaned, _ = REMOVE_BLOCK.subn('', html)

    # Insert markup after <body ...>
    m = re.search(r'<body[^>]*>', cleaned, re.IGNORECASE)
    if not m:
        return False, 'no <body>'
    prefix = rel_prefix(path)
    injection = build_mobile_nav(prefix)
    new_html = cleaned[: m.end()] + "\n" + injection + cleaned[m.end():]

    if apply:
        path.write_text(new_html, encoding='utf-8')
    return True, 'inserted unified mobile nav'


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if not args.apply and not args.dry_run:
        args.dry_run = True

    changed = 0
    scanned = 0
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


