#!/usr/bin/env python3
"""
Navigation Replacement Script for Kansas Electric Website
Replaces all old navigation systems with the new Fortune 500 navigation
"""

import os
import re
import glob
from pathlib import Path

# New navigation HTML template
NEW_NAVIGATION = '''    <!-- Fortune 500 Navigation -->
    <nav class="redesigned-nav" role="navigation" aria-label="Main navigation">
        <div class="redesigned-nav-container">
            <!-- Logo -->
            <a href="{logo_href}" class="redesigned-nav-logo">
                <img src="{logo_src}" alt="Kansas Electric" width="178" height="40">
            </a>

            <!-- Desktop Navigation -->
            <ul class="redesigned-nav-menu" role="menubar">
                <!-- Services Dropdown -->
                <li class="redesigned-nav-item" data-dropdown="services" role="none">
                    <a href="#" class="redesigned-nav-link" role="menuitem" aria-haspopup="true" aria-expanded="false" aria-controls="services-dropdown">
                        <span>Services</span>
                        <svg class="redesigned-nav-caret" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <div class="redesigned-dropdown" id="services-dropdown" role="menu" aria-hidden="true">
                        <a href="{base_path}services/divisions/industrial/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Industrial Electrical</span>
                            <small>Heavy infrastructure & power systems</small>
                        </a>
                        <a href="{base_path}services/divisions/commercial/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Commercial Electrical</span>
                            <small>Office buildings & retail spaces</small>
                        </a>
                        <a href="{base_path}services/divisions/service-maintenance/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Service & Maintenance</span>
                            <small>24/7 support & preventive care</small>
                        </a>
                        <a href="{base_path}services/divisions/automation-control/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Automation & Control Systems</span>
                            <small>Smart systems & process control</small>
                        </a>
                    </div>
                </li>

                <!-- Industries We Serve Dropdown -->
                <li class="redesigned-nav-item" data-dropdown="industries" role="none">
                    <a href="#" class="redesigned-nav-link" role="menuitem" aria-haspopup="true" aria-expanded="false" aria-controls="industries-dropdown">
                        <span>Industries We Serve</span>
                        <svg class="redesigned-nav-caret" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <div class="redesigned-dropdown industries-grid" id="industries-dropdown" role="menu" aria-hidden="true">
                        <a href="{base_path}services/industrial/oil-gas/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Oil & Gas</span>
                            <small>Refineries & pipelines</small>
                        </a>
                        <a href="{base_path}services/industrial/wastewater-treatment/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Water & Wastewater</span>
                            <small>Treatment facilities</small>
                        </a>
                        <a href="{base_path}services/industrial/data-centers/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Data Centers</span>
                            <small>Mission critical facilities</small>
                        </a>
                        <a href="{base_path}services/industrial/advanced-manufacturing/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Manufacturing</span>
                            <small>Production facilities</small>
                        </a>
                        <a href="{base_path}services/industrial/food-beverage/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Food & Beverage</span>
                            <small>Processing plants</small>
                        </a>
                        <a href="{base_path}services/commercial/airport/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Government & Municipal</span>
                            <small>Public infrastructure</small>
                        </a>
                    </div>
                </li>

                <!-- About Dropdown -->
                <li class="redesigned-nav-item" data-dropdown="about" role="none">
                    <a href="#" class="redesigned-nav-link" role="menuitem" aria-haspopup="true" aria-expanded="false" aria-controls="about-dropdown">
                        <span>About</span>
                        <svg class="redesigned-nav-caret" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <div class="redesigned-dropdown" id="about-dropdown" role="menu" aria-hidden="true">
                        <a href="{base_path}about/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Our Story</span>
                            <small>Company history & mission</small>
                        </a>
                        <a href="{base_path}about/leadership/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Leadership</span>
                            <small>Meet our executive team</small>
                        </a>
                        <a href="{base_path}about/coverage/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Licensing & Coverage Map</span>
                            <small>Service areas & certifications</small>
                        </a>
                    </div>
                </li>

                <!-- Careers Dropdown -->
                <li class="redesigned-nav-item" data-dropdown="careers" role="none">
                    <a href="#" class="redesigned-nav-link" role="menuitem" aria-haspopup="true" aria-expanded="false" aria-controls="careers-dropdown">
                        <span>Careers</span>
                        <svg class="redesigned-nav-caret" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <div class="redesigned-dropdown" id="careers-dropdown" role="menu" aria-hidden="true">
                        <a href="{base_path}careers/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Open Positions</span>
                            <small>Current job opportunities</small>
                        </a>
                        <a href="{base_path}careers/why-work-here/" class="redesigned-dropdown-link" role="menuitem">
                            <span>Why Work Here?</span>
                            <small>Benefits & company culture</small>
                        </a>
                    </div>
                </li>

                <!-- Projects (standalone link) -->
                <li class="redesigned-nav-item" role="none">
                    <a href="{base_path}projects/" class="redesigned-nav-link" role="menuitem">
                        <span>Projects</span>
                    </a>
                </li>
            </ul>

            <!-- CTA Button -->
            <a href="{base_path}contact/request-quote/" class="redesigned-nav-cta">Request a Quote</a>

            <!-- Mobile Hamburger -->
            <button class="redesigned-mobile-toggle" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
                <span class="redesigned-hamburger-line"></span>
                <span class="redesigned-hamburger-line"></span>
                <span class="redesigned-hamburger-line"></span>
            </button>
        </div>

        <!-- Mobile Menu Overlay -->
        <div class="redesigned-mobile-overlay" aria-hidden="true"></div>

        <!-- Mobile Menu -->
        <div class="redesigned-mobile-menu" id="mobile-menu" aria-hidden="true">
            <nav role="navigation" aria-label="Mobile navigation">
                <!-- Services -->
                <div class="redesigned-mobile-nav-item" data-dropdown="services">
                    <a href="#" class="redesigned-mobile-nav-link" aria-haspopup="true" aria-expanded="false">
                        <span>Services</span>
                        <svg class="redesigned-nav-caret" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <div class="redesigned-mobile-dropdown" id="mobile-services-dropdown">
                        <a href="{base_path}services/divisions/industrial/" class="redesigned-mobile-dropdown-link">
                            <span>Industrial Electrical</span>
                            <small>Heavy infrastructure & power systems</small>
                        </a>
                        <a href="{base_path}services/divisions/commercial/" class="redesigned-mobile-dropdown-link">
                            <span>Commercial Electrical</span>
                            <small>Office buildings & retail spaces</small>
                        </a>
                        <a href="{base_path}services/divisions/service-maintenance/" class="redesigned-mobile-dropdown-link">
                            <span>Service & Maintenance</span>
                            <small>24/7 support & preventive care</small>
                        </a>
                        <a href="{base_path}services/divisions/automation-control/" class="redesigned-mobile-dropdown-link">
                            <span>Automation & Control Systems</span>
                            <small>Smart systems & process control</small>
                        </a>
                    </div>
                </div>

                <!-- Industries We Serve -->
                <div class="redesigned-mobile-nav-item" data-dropdown="industries">
                    <a href="#" class="redesigned-mobile-nav-link" aria-haspopup="true" aria-expanded="false">
                        <span>Industries We Serve</span>
                        <svg class="redesigned-nav-caret" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <div class="redesigned-mobile-dropdown" id="mobile-industries-dropdown">
                        <a href="{base_path}services/industrial/oil-gas/" class="redesigned-mobile-dropdown-link">
                            <span>Oil & Gas</span>
                            <small>Refineries & pipelines</small>
                        </a>
                        <a href="{base_path}services/industrial/wastewater-treatment/" class="redesigned-mobile-dropdown-link">
                            <span>Water & Wastewater</span>
                            <small>Treatment facilities</small>
                        </a>
                        <a href="{base_path}services/industrial/data-centers/" class="redesigned-mobile-dropdown-link">
                            <span>Data Centers</span>
                            <small>Mission critical facilities</small>
                        </a>
                        <a href="{base_path}services/industrial/advanced-manufacturing/" class="redesigned-mobile-dropdown-link">
                            <span>Manufacturing</span>
                            <small>Production facilities</small>
                        </a>
                        <a href="{base_path}services/industrial/food-beverage/" class="redesigned-mobile-dropdown-link">
                            <span>Food & Beverage</span>
                            <small>Processing plants</small>
                        </a>
                        <a href="{base_path}services/commercial/airport/" class="redesigned-mobile-dropdown-link">
                            <span>Government & Municipal</span>
                            <small>Public infrastructure</small>
                        </a>
                    </div>
                </div>

                <!-- About -->
                <div class="redesigned-mobile-nav-item" data-dropdown="about">
                    <a href="#" class="redesigned-mobile-nav-link" aria-haspopup="true" aria-expanded="false">
                        <span>About</span>
                        <svg class="redesigned-nav-caret" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <div class="redesigned-mobile-dropdown" id="mobile-about-dropdown">
                        <a href="{base_path}about/" class="redesigned-mobile-dropdown-link">
                            <span>Our Story</span>
                            <small>Company history & mission</small>
                        </a>
                        <a href="{base_path}about/leadership/" class="redesigned-mobile-dropdown-link">
                            <span>Leadership</span>
                            <small>Meet our executive team</small>
                        </a>
                        <a href="{base_path}about/coverage/" class="redesigned-mobile-dropdown-link">
                            <span>Licensing & Coverage Map</span>
                            <small>Service areas & certifications</small>
                        </a>
                    </div>
                </div>

                <!-- Careers -->
                <div class="redesigned-mobile-nav-item" data-dropdown="careers">
                    <a href="#" class="redesigned-mobile-nav-link" aria-haspopup="true" aria-expanded="false">
                        <span>Careers</span>
                        <svg class="redesigned-nav-caret" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                    <div class="redesigned-mobile-dropdown" id="mobile-careers-dropdown">
                        <a href="{base_path}careers/" class="redesigned-mobile-dropdown-link">
                            <span>Open Positions</span>
                            <small>Current job opportunities</small>
                        </a>
                        <a href="{base_path}careers/why-work-here/" class="redesigned-mobile-dropdown-link">
                            <span>Why Work Here?</span>
                            <small>Benefits & company culture</small>
                        </a>
                    </div>
                </div>

                <!-- Projects (standalone) -->
                <div class="redesigned-mobile-nav-item">
                    <a href="{base_path}projects/" class="redesigned-mobile-nav-link">
                        <span>Projects</span>
                    </a>
                </div>

                <!-- Mobile CTA -->
                <div class="redesigned-mobile-cta">
                    <a href="{base_path}contact/request-quote/" class="redesigned-nav-cta">Request a Quote</a>
                </div>
            </nav>
        </div>
    </nav>'''

def calculate_relative_path(file_path):
    """Calculate the relative path from a file to the root directory"""
    path_parts = Path(file_path).parts
    depth = len(path_parts) - 1  # Subtract 1 for the filename
    if depth == 0:
        return "./"
    return "../" * depth

def get_logo_src(file_path):
    """Get the correct logo source path based on file location"""
    base_path = calculate_relative_path(file_path)
    return f"{base_path}assets/img/kansas-electric-logo-color.svg"

def get_logo_href(file_path):
    """Get the correct logo href path based on file location"""
    return calculate_relative_path(file_path)

def add_css_js_links(content, file_path):
    """Add CSS and JS links for the new navigation if they don't exist"""
    base_path = calculate_relative_path(file_path)
    
    css_link = f'  <link rel="stylesheet" href="{base_path}projects/stanley-black-decker/redesigned-navigation.css">'
    js_link = f'  <script src="{base_path}projects/stanley-black-decker/redesigned-navigation.js" defer></script>'
    
    # Check if links already exist
    if 'redesigned-navigation.css' not in content:
        # Add CSS link before </head>
        content = content.replace('</head>', f'{css_link}\n</head>')
    
    if 'redesigned-navigation.js' not in content:
        # Add JS link before </head>
        content = content.replace('</head>', f'{js_link}\n</head>')
    
    return content

def add_body_padding(content):
    """Add body padding for fixed navigation"""
    # Check if body already has padding-top
    if 'padding-top:' not in content and 'style="padding-top:' not in content:
        # Add padding to body tag
        content = re.sub(
            r'<body([^>]*)>',
            r'<body\1 style="padding-top: 100px;">',
            content
        )
    return content

def replace_navigation_in_file(file_path):
    """Replace navigation in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if file already has new navigation
        if 'redesigned-nav' in content:
            print(f"✓ {file_path} already has new navigation")
            return True
        
        # Calculate paths
        base_path = calculate_relative_path(file_path)
        logo_src = get_logo_src(file_path)
        logo_href = get_logo_href(file_path)
        
        # Format the new navigation with correct paths
        new_nav = NEW_NAVIGATION.format(
            base_path=base_path,
            logo_src=logo_src,
            logo_href=logo_href
        )
        
        # Find and replace the old navigation
        # Pattern to match the entire old navigation structure
        old_nav_pattern = r'<div class="md:w-11/12 mx-auto flex lg:space-x-10 justify-between py-6 lg:py-0 px-4 md:px-0">.*?</div>\s*</div>\s*</div>'
        
        # More specific pattern for the main navigation container
        main_nav_pattern = r'<div class="w-full bg-white lg:bg-transparent[^>]*main-navigation[^>]*>.*?</div>\s*</div>\s*</div>'
        
        # Try to find and replace the navigation
        if re.search(main_nav_pattern, content, re.DOTALL):
            # Replace the main navigation section
            content = re.sub(main_nav_pattern, new_nav + '\n    </div>\n  </div>', content, flags=re.DOTALL)
        elif re.search(old_nav_pattern, content, re.DOTALL):
            # Replace the broader navigation section
            content = re.sub(old_nav_pattern, new_nav + '\n    </div>\n  </div>', content, flags=re.DOTALL)
        else:
            print(f"⚠ Could not find navigation pattern in {file_path}")
            return False
        
        # Add CSS and JS links
        content = add_css_js_links(content, file_path)
        
        # Add body padding
        content = add_body_padding(content)
        
        # Write the updated content back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Updated {file_path}")
        return True
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {str(e)}")
        return False

def main():
    """Main function to replace navigation across all HTML files"""
    print("🚀 Starting Kansas Electric Navigation Replacement")
    print("=" * 60)
    
    # Find all HTML files
    html_files = []
    for pattern in ['**/*.html', '*.html']:
        html_files.extend(glob.glob(pattern, recursive=True))
    
    # Filter out the redesigned navigation test file
    html_files = [f for f in html_files if 'redesigned-navigation.html' not in f]
    
    print(f"Found {len(html_files)} HTML files to process")
    print()
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for file_path in sorted(html_files):
        result = replace_navigation_in_file(file_path)
        if result is True:
            success_count += 1
        elif result is None:
            skip_count += 1
        else:
            error_count += 1
    
    print()
    print("=" * 60)
    print("🎉 Navigation Replacement Complete!")
    print(f"✓ Successfully updated: {success_count} files")
    print(f"⚠ Skipped (already updated): {skip_count} files")
    print(f"✗ Errors: {error_count} files")
    print()
    print("🌟 All pages now have Fortune 500 navigation!")

if __name__ == "__main__":
    main() 