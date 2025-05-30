# CodeDrop Chrome Extension

## Installation for Development

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked" 
4. Select the `codin/` directory from this project
5. The extension should now appear in your extensions list

## Development Setup

### API Configuration

The extension is configured to use:
- **Production API**: `https://codin.site/api/create` (active)
- **Development API**: `http://localhost:3001/api/create` (commented out)

To switch to development mode, edit `popup.js` and update the `API_URL` constant, and add `http://localhost:*` to the `host_permissions` in `manifest.json`.

### Permissions

The extension requires the following permissions:
- `clipboardWrite`: To copy URLs and owner codes
- `activeTab`: To access selected text from the current tab
- `storage`: To save snippet history
- `https://codin.site/*`: For production API access

## Features

- **Quick Snippet Creation**: Create snippets without visiting the website
- **Selected Text Detection**: Automatically capture selected text from web pages
- **Language Auto-detection**: Detect programming language based on file extensions
- **All Snippet Options**: Support for expiration, view limits, password protection
- **Owner Code Management**: Receive and securely store owner codes for editing/deleting snippets
- **Persistent Owner Codes**: Owner codes are saved and accessible even after closing the extension
- **Recent Snippet Access**: View recently created snippets (within 5 minutes) when reopening the extension
- **History Tracking**: Keep track of recently created snippets with owner codes

## Debugging

### Enable Console Logging

1. Right-click the extension icon → "Inspect popup"
2. Check the Console tab for debug messages
3. The extension logs detailed information about API calls and responses

### Common Issues

1. **CORS Errors**: Make sure the development server is running on `localhost:3001`
2. **Missing Owner Code**: Check console logs for API response details
3. **Permission Denied**: Ensure all required permissions are granted in Chrome

### Testing

The extension can be tested by installing it and using it on any webpage. Check the console logs for detailed debugging information during snippet creation.

## Usage

1. Select text on any webpage (optional)
2. Click the CodeDrop extension icon
3. Configure snippet settings
4. Click "Create Snippet"
5. **COPY THE OWNER CODE FIRST** - Look for the red "COPY FIRST!" badge
6. Copy the snippet URL for sharing

### Important UX Notes

- **Owner Code Persistence**: If you close the extension after creating a snippet, it will automatically show your recent snippet (within 5 minutes) when you reopen it
- **Copy Priority**: Always copy the owner code before navigating away, as the red badge and glowing button indicate
- **Recent Snippet Access**: The extension remembers your last created snippet for 5 minutes for easy access
- **Clear Recent**: Use the "Clear Recent" button to start fresh and create a new snippet

⚠️ **Important**: Save the owner code securely - it's required for editing or deleting the snippet. The extension now saves it temporarily for your convenience, but you should still copy it to a secure location.

### API Integration

The extension communicates with the CodeDrop API and handles both response formats:

**New Format (local development):**
```json
{
  "success": true,
  "shortId": "ABC12345",
  "ownerCode": "OWN-XXXXXXXXX"
}
```

**Legacy Format (production):**
```json
{
  "success": true,
  "shortId": {
    "shortId": "ABC12345",
    "ownerCode": "OWN-XXXXXXXXX"
  }
}
```

The extension automatically detects and handles both formats for maximum compatibility. 