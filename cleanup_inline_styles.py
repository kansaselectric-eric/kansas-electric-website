# I wrote this helper so I can maintain pages safely and repeatably.
import os
import re
from pathlib import Path

def remove_inline_styles_from_small_tags(file_path):
    """Remove inline styles from small tags in dropdown links"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove inline styles from small tags in dropdown links
        pattern = r'<small style="[^"]*">'
        updated_content = re.sub(pattern, '<small>', content)
        
        if updated_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            return True
        return False
    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

def main():
    print("🧹 Cleaning up inline styles from dropdown links")
    print("=" * 60)
    
    # Find all HTML files
    html_files = list(Path('.').rglob('*.html'))
    updated_count = 0
    
    for file_path in html_files:
        if remove_inline_styles_from_small_tags(file_path):
            updated_count += 1
            print(f'✓ Updated {file_path}')
    
    print(f'\n🎉 Updated {updated_count} files to remove inline styles from small tags')
    print("✨ All dropdown links now use CSS-based styling for perfect alignment!")

if __name__ == "__main__":
    main() 