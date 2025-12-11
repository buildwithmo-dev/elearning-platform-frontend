import os
import re

def scan_for_api_endpoints(root_dir='src'):
    api_endpoints = set()
    pattern = re.compile(r'["\']((?:https?://[^/"\']+|/|)\S+?)[?#"\']')
    # This tries to capture the path/URL that starts with optional http(s):// or /
    # and ends before a new quote, query param '?', or hash '#'.

    print(f"--- Scanning directory: {os.path.abspath(root_dir)} ---")

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.jsx'):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Find all matches in the file content
                    matches = pattern.findall(content)

                    for match in matches:
                        if not any(ext in match.lower() for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.css', '.js', '.map', '.html']):
                             # Simple filtering for relative paths: check for at least one slash
                             if match.startswith('/') or '://' in match or ('/' in match and match.count('/') > 0):
                                api_endpoints.add(match)

                except Exception as e:
                    print(f"Could not read {filepath}: {e}")

    print("\n--- Unique API Endpoints Found ---")
    if api_endpoints:
        # Sort for better readability
        sorted_endpoints = sorted(list(api_endpoints))
        for endpoint in sorted_endpoints:
            print(f"- {endpoint}")
    else:
        print("No apparent API endpoints were found.")

    print("\n----------------------------------")
    print("NOTE: This script uses a heuristic pattern and may include non-API links or miss some complex API constructions.")


if __name__ == '__main__':
    # Assuming your 'src' directory is in the same folder as apis.py
    scan_for_api_endpoints()