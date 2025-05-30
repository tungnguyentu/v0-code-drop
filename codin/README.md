# Codin Chrome Extension

A powerful Chrome extension for creating, editing, and managing code snippets directly from your browser.

## Features

### ✨ Create Snippets
- Create code snippets from selected text or manual input
- Auto-detect programming language from file extensions
- Set expiration times (5 minutes to never)
- Configure view limits (1 view to unlimited)
- Optional password protection
- Support for 16+ programming languages

### 🔧 Manage Snippets
- Edit existing snippets with owner code verification
- Delete snippets permanently
- Update expiration and view limit settings
- Quick view snippets in new tabs

### 🔒 Security Features
- Single owner code system (OWN-ABC123DEF456 format)
- Secure bcrypt hashing for code storage
- Two-step deletion confirmation
- Owner code validation and formatting

## Installation

1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The Codin icon will appear in your toolbar

## Usage

### Creating a Snippet

1. Click the Codin extension icon
2. Make sure you're on the "Create" tab
3. Fill in the form:
   - **Title**: Optional title for your snippet
   - **Content**: Your code or text (auto-filled if text is selected on page)
   - **Language**: Programming language for syntax highlighting
   - **Expiration**: When the snippet should expire
   - **View Limit**: Maximum number of views allowed
   - **Password**: Optional password protection
4. Click "Create Snippet"
5. **Important**: Copy and save your owner code! You'll need it to edit or delete the snippet

### Managing Existing Snippets

1. Click the Codin extension icon
2. Switch to the "Manage" tab
3. Enter the snippet URL or ID
4. Enter your owner code (OWN-ABC123DEF456 format)
5. Choose an action:
   - **Edit**: Modify the snippet content and settings
   - **Delete**: Permanently remove the snippet
   - **View**: Open the snippet in a new tab

### Editing a Snippet

1. From the Manage tab, enter snippet details and click "Edit"
2. Modify any of the following:
   - Title and content
   - Programming language
   - Expiration time (calculated from current time)
   - View limit (cannot be set below current view count)
3. Click "Save Changes" to update

### Security Notes

- **Owner codes are not recoverable** - save them securely
- Owner codes use format: `OWN-ABC123DEF456` (16 characters total)
- All operations require valid owner code verification
- Deletion requires confirmation to prevent accidents

## Supported Languages

- Plain Text
- JavaScript
- TypeScript
- Python
- Java
- C#
- C++
- Go
- Rust
- PHP
- Ruby
- HTML
- CSS
- SQL
- JSON
- Markdown
- Bash

## Keyboard Shortcuts

- The extension automatically detects and fills selected text from web pages
- Language auto-detection based on file extensions
- Owner code auto-formatting as you type

## Troubleshooting

### Common Issues

**Extension won't load snippets for editing:**
- Verify the snippet URL/ID is correct
- Ensure your owner code is exactly 16 characters (OWN-ABC123DEF456)
- Check that the snippet hasn't expired

**Can't set view limit:**
- New view limit must be higher than current view count
- Use "Unlimited" if you need to remove restrictions

**API errors:**
- Check your internet connection
- The extension will retry via background script if direct calls fail
- Clear extension data in Chrome settings if persistent issues occur

### Error Messages

- "Invalid owner code" - Check format and try again
- "Snippet not found" - Verify URL/ID or snippet may have expired
- "View limit too low" - Current views exceed the limit you're trying to set

## Privacy

- No data is stored locally except snippet history (last 50 snippets)
- Owner codes are hashed on the server using bcrypt
- Extension only communicates with codin.site API
- No tracking or analytics in the extension

## Version History

### v1.1.0
- Added snippet management (edit/delete functionality)
- Implemented owner code verification system
- Added navigation tabs between Create and Manage modes
- Enhanced security with confirmation dialogs
- Improved error handling and user feedback

### v1.0.0
- Initial release with snippet creation
- Password protection support
- Language auto-detection
- Basic clipboard integration

## Support

For issues or questions:
1. Check this README for common solutions
2. Verify your owner codes are saved correctly
3. Try refreshing the extension or reloading it
4. Report bugs through the Chrome Web Store or project repository

## Permissions

The extension requires these permissions:
- `activeTab`: To read selected text from web pages
- `storage`: To save snippet history locally
- `clipboardWrite`: To copy URLs and owner codes
- `host_permissions`: To communicate with codin.site API 