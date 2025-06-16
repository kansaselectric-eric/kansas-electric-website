#!/usr/bin/env python3
"""
Script to replace navigation menus across all pages with the home page navigation.
This ensures consistent navigation structure and functionality across the entire website.
"""

import os
import re
from pathlib import Path

def extract_home_navigation():
    """Extract the complete navigation structure from the home page."""
    
    # Read the home page
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the CSS styles (from <style> tag in head)
    css_pattern = r'<!-- Anti-flicker style block.*?</style>'
    css_match = re.search(css_pattern, content, re.DOTALL)
    css_styles = css_match.group(0) if css_match else ""
    
    # Extract the navigation HTML (from <nav class="kse-nav"> to </nav>)
    nav_pattern = r'<!-- UNIFIED KANSAS ELECTRIC NAVIGATION -->\s*<nav class="kse-nav".*?</nav>'
    nav_match = re.search(nav_pattern, content, re.DOTALL)
    nav_html = nav_match.group(0) if nav_match else ""
    
    # Extract the mobile top bar HTML
    mobile_bar_pattern = r'<!-- Mobile Top Bar -->\s*<div class="mobile-top-bar.*?</div>'
    mobile_bar_match = re.search(mobile_bar_pattern, content, re.DOTALL)
    mobile_bar_html = mobile_bar_match.group(0) if mobile_bar_match else ""
    
    # Extract the JavaScript (Navigation Dropdown Script)
    js_pattern = r'<!-- Navigation Dropdown Script -->\s*<script>.*?</script>'
    js_match = re.search(js_pattern, content, re.DOTALL)
    js_script = js_match.group(0) if js_match else ""
    
    return css_styles, nav_html, mobile_bar_html, js_script

def update_page_navigation(file_path, css_styles, nav_html, mobile_bar_html, js_script):
    """Update a single page's navigation with the home page navigation."""
    
    print(f"Updating navigation for: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Adjust relative paths based on directory depth
        depth = len(Path(file_path).parts) - 1
        if depth > 0:
            # Adjust paths in CSS
            adjusted_css = css_styles.replace('src="./assets/', f'src="{"../" * depth}assets/')
            adjusted_css = adjusted_css.replace('href="./', f'href="{"../" * depth}')
            
            # Adjust paths in HTML
            adjusted_nav = nav_html.replace('href="./', f'href="{"../" * depth}')
            adjusted_nav = adjusted_nav.replace('src="./assets/', f'src="{"../" * depth}assets/')
            
            # Adjust paths in mobile bar HTML
            adjusted_mobile_bar = mobile_bar_html.replace('src="./assets/', f'src="{"../" * depth}assets/')
        else:
            adjusted_css = css_styles
            adjusted_nav = nav_html
            adjusted_mobile_bar = mobile_bar_html
        
        # Remove existing navigation styles - more comprehensive removal
        content = re.sub(r'<!-- Anti-flicker style block.*?</style>', '', content, flags=re.DOTALL)
        content = re.sub(r'<!-- UNIFIED GLOBAL NAVIGATION SYSTEM -->.*?</style>', '', content, flags=re.DOTALL)
        content = re.sub(r'<style>.*?\.kse-nav.*?</style>', '', content, flags=re.DOTALL)
        content = re.sub(r'<style>.*?\.redesigned-nav.*?</style>', '', content, flags=re.DOTALL)
        
        # Remove existing navigation HTML - more comprehensive removal
        content = re.sub(r'<!-- UNIFIED KANSAS ELECTRIC NAVIGATION -->.*?</nav>', '', content, flags=re.DOTALL)
        content = re.sub(r'<nav class="kse-nav".*?</nav>', '', content, flags=re.DOTALL)
        content = re.sub(r'<nav class="redesigned-nav".*?</nav>', '', content, flags=re.DOTALL)
        content = re.sub(r'<header class="site-header".*?</header>', '', content, flags=re.DOTALL)
        
        # Remove existing mobile top bar
        content = re.sub(r'<!-- Mobile Top Bar -->.*?</div>', '', content, flags=re.DOTALL)
        
        # Remove existing navigation JavaScript
        content = re.sub(r'<!-- Navigation Dropdown Script -->.*?</script>', '', content, flags=re.DOTALL)
        
        # Insert new CSS styles in the head section
        head_end = content.find('</head>')
        if head_end != -1:
            content = content[:head_end] + '\n  ' + adjusted_css + '\n' + content[head_end:]
        
        # Insert new navigation HTML after the opening body tag
        body_start = content.find('<body')
        if body_start != -1:
            body_end = content.find('>', body_start) + 1
            content = content[:body_end] + '\n  ' + adjusted_nav + '\n' + content[body_end:]
        
        # Insert mobile top bar after navigation
        nav_end = content.find('</nav>')
        if nav_end != -1:
            nav_end = content.find('\n', nav_end) + 1
            content = content[:nav_end] + '\n  ' + adjusted_mobile_bar + '\n' + content[nav_end:]
        
        # Insert JavaScript before closing body tag
        body_close = content.rfind('</body>')
        if body_close != -1:
            content = content[:body_close] + '\n  ' + js_script + '\n' + content[body_close:]
        
        # Write the updated content back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Successfully updated: {file_path}")
        
    except Exception as e:
        print(f"❌ Error updating {file_path}: {str(e)}")

def find_all_html_files():
    """Find all HTML files in the project, including index.html files in subdirectories."""
    html_files = []
    
    # Main directories to check for index.html files
    main_dirs = ['about', 'careers', 'services', 'projects', 'contact', 'company-news', 'job-openings', 'rsvp', 'rsvp-thanks']
    
    # Add main directory index.html files
    for dir_name in main_dirs:
        index_path = os.path.join(dir_name, 'index.html')
        if os.path.exists(index_path):
            html_files.append(index_path.replace('\\', '/'))
    
    # Also find all other HTML files recursively
    for root, dirs, files in os.walk('.'):
        # Skip hidden directories, node_modules, and backup directories
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules' and 'backup' not in d.lower()]
        
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                # Convert to forward slashes and remove leading ./
                file_path = file_path.replace('\\', '/').lstrip('./')
                
                # Skip the main index.html and avoid duplicates
                if file_path != 'index.html' and file_path not in html_files:
                    html_files.append(file_path)
    
    return html_files

def main():
    """Main function to update all navigation menus."""
    print("🚀 Starting navigation update process...")
    
    # Extract navigation components from home page
    print("📄 Extracting navigation from home page...")
    css_styles, nav_html, mobile_bar_html, js_script = extract_home_navigation()
    
    if not css_styles or not nav_html or not js_script:
        print("❌ Failed to extract navigation components from home page")
        print(f"CSS found: {bool(css_styles)}")
        print(f"HTML found: {bool(nav_html)}")
        print(f"Mobile bar found: {bool(mobile_bar_html)}")
        print(f"JS found: {bool(js_script)}")
        return
    
    print("✅ Successfully extracted navigation components")
    
    # Find all HTML files
    html_files = find_all_html_files()
    print(f"📁 Found {len(html_files)} HTML files to update")
    
    # Show first few files for verification
    print("First few files to update:")
    for file in html_files[:10]:
        print(f"  - {file}")
    if len(html_files) > 10:
        print(f"  ... and {len(html_files) - 10} more files")
    
    # Update each file
    updated_count = 0
    for file_path in html_files:
        try:
            update_page_navigation(file_path, css_styles, nav_html, mobile_bar_html, js_script)
            updated_count += 1
        except Exception as e:
            print(f"❌ Failed to update {file_path}: {str(e)}")
    
    print(f"\n🎉 Navigation update complete!")
    print(f"✅ Successfully updated {updated_count} out of {len(html_files)} files")

if __name__ == "__main__":
    main() 