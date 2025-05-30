# CodeDrop - Code Snippet Sharing Platform

## Project Overview

CodeDrop is a web application for creating, sharing, and managing code snippets with a simple owner-based management system using a single secure code. Users can create snippets and receive an owner code that allows them to edit or delete their snippets later. The application is built with Next.js, React, and uses Supabase for data storage.

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js Server Actions, Supabase
- **Authentication**: bcrypt for password hashing and code verification
- **UI Components**: Radix UI, shadcn/ui
- **Code Editor**: Custom CodeEditor component

## Project Structure

```
/
├── app/                      # Next.js app directory
│   ├── actions.ts            # Server actions for snippet CRUD
│   ├── api/                  # API routes
│   ├── [id]/                 # Dynamic routes for viewing snippets
│   │   └── edit/             # Edit snippet routes
│   ├── admin/                # Admin panel
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ui/                   # Base UI components
│   ├── code-editor.tsx       # Code editor component
│   ├── paste-form.tsx        # Form for creating snippets
│   ├── view-paste.tsx        # Component for viewing snippets with edit/delete buttons
│   ├── owner-code-modal.tsx  # Modal for entering owner codes
│   └── edit-snippet.tsx      # Component for editing snippets
├── codin/                    # Browser extension
│   ├── manifest.json         # Extension manifest
│   ├── popup.html            # Extension popup
│   └── popup.js              # Extension logic
├── lib/                      # Utility functions
│   ├── supabase/             # Supabase client setup
│   ├── auth.ts               # Authentication utilities
│   ├── cache.ts              # Caching utilities
│   ├── constants.ts          # Application constants
│   ├── language-detection.ts # Language detection utilities
│   └── owner-codes.ts        # Owner code generation and verification
├── public/                   # Static assets
└── styles/                   # CSS styles
```

## Core Features

### 1. Code Snippet Creation

Users can create code snippets with:
- Title (optional)
- Content (with syntax highlighting)
- Language selection (with auto-detection)
- Theme selection for syntax highlighting
- Expiration settings (5 minutes, 1 hour, 1 day, 1 week, never)
- View limits (1, 5, 10, unlimited)
- Password protection

Upon creation, users receive a single owner code:
- **Owner Code**: Full access for both editing and deleting (OWN-ABC123DEF format, 12 chars)

Implementation: `components/paste-form.tsx` and `app/actions.ts`

### 2. Snippet Viewing

- Syntax highlighted code display
- Edit and Delete buttons in the snippet toolbar
- Password verification for protected snippets
- View counter for limited view snippets
- Automatic deletion of expired snippets
- Theme switcher for real-time syntax highlighting changes

Implementation: `components/view-paste.tsx` and `app/[id]/page.tsx`

### 3. Owner-Based Management System

The application uses a simple code-based system for snippet ownership:

#### Code Generation (`lib/owner-codes.ts`)
- Generates a single owner code with OWN-ABC123DEF format
- Uses bcrypt for secure storage in database
- Validates code format and structure

#### Owner Code Modal (`components/owner-code-modal.tsx`)
- Reusable modal component for entering owner codes
- Used for both edit and delete operations
- Includes error handling and loading states

#### Edit Functionality (`components/edit-snippet.tsx`)
- Full editing interface for snippet content, title, language, and theme
- Language auto-detection on content changes
- Save/cancel functionality with change tracking
- Accessed via Edit button after owner code verification

#### Delete Functionality
- Delete button triggers owner code verification
- Secondary confirmation dialog for safety
- Permanent deletion with redirect to home page

### 4. Browser Extension

A Chrome extension that allows users to create snippets directly from their browser:
- Quick snippet creation
- Integration with the main application
- Clipboard functionality

Implementation: `codin/` directory

## Database Schema

The application uses Supabase with the following main table:

### Pastes Table
- `id`: Primary key
- `short_id`: Unique identifier for the paste URL
- `title`: Optional title
- `content`: Code content
- `language`: Programming language
- `expires_at`: Expiration timestamp
- `view_limit`: Maximum number of views
- `view_count`: Current view count
- `password_hash`: Hashed password (if protected)
- `is_protected`: Boolean indicating if password protected
- `theme`: Syntax highlighting theme
- `owner_code`: Hashed owner management code
- `created_ip`: IP address of creator (optional)
- `created_at`: Creation timestamp

## Key Components

### PasteForm (`components/paste-form.tsx`)
Handles the creation of new code snippets and displays the owner code after creation with prominent warning messages.

### ViewPaste (`components/view-paste.tsx`)
Displays existing snippets with syntax highlighting and includes Edit and Delete buttons that trigger the owner code modal.

### OwnerCodeModal (`components/owner-code-modal.tsx`)
Reusable modal component for entering owner codes with error handling and proper validation feedback.

### EditSnippet (`components/edit-snippet.tsx`)
Provides editing interface for existing snippets with change tracking and validation.

### CodeEditor (`components/code-editor.tsx`)
Custom code editor component with syntax highlighting support.

### Server Actions (`app/actions.ts`)
Server-side functions for:
- `createPaste`: Creates a new snippet and returns owner code
- `getPasteById`: Retrieves a snippet by ID
- `verifyPastePassword`: Validates password for protected snippets
- `verifyOwnerCode`: Validates owner code
- `getSnippetForEdit`: Gets snippet data for editing (requires valid owner code)
- `updateSnippet`: Updates existing snippet content
- `deleteSnippet`: Permanently deletes a snippet
- `cleanupExpiredPastes`: Removes expired snippets

## Authentication and Security

- **Code-based ownership**: No user accounts required
- **Secure code storage**: Owner codes are hashed using bcrypt
- **Code format validation**: Ensures codes match expected OWN-XXXXXXXXX pattern
- **Single-use display**: Owner codes are shown only once after creation
- **Password protection**: Uses bcrypt for secure password hashing
- **Automatic cleanup**: Expired and view-limited snippets are automatically removed

## Owner Code System

### Code Format
- **Owner Code** (OWN-ABC123DEF): 12-character code providing full access to edit and delete

### Code Security
- All codes are hashed before storage using bcrypt
- Format validation prevents malformed codes
- Codes are only displayed once after snippet creation
- Rate limiting prevents brute force attacks (recommended for production)

### User Experience
- Clear warning messages about saving the code securely
- Copy functionality for easy code storage
- Edit/Delete buttons always visible on snippet view
- Two-step process: code verification → action confirmation (for delete)

## User Interface Flow

### Creation Flow:
1. User creates snippet → success page shows owner code with prominent warnings
2. Code disappears after leaving the page (one-time display)

### Edit Flow:
1. Click Edit button → Owner code modal appears
2. Enter code → Verify → Redirect to edit form with pre-populated data
3. Make changes → Save → Redirect back to snippet view

### Delete Flow:
1. Click Delete button → Owner code modal appears  
2. Enter code → Verify → Confirmation dialog
3. Confirm deletion → Delete snippet → Redirect to home

## Browser Extension

The browser extension (`codin/` directory) allows users to:
- Create snippets from selected text in any webpage
- Configure snippet options directly from the extension
- Share snippet links easily

## Chrome Extension

CodeDrop includes a Chrome extension that allows users to create snippets directly from their browser.

### Features

- **Quick Snippet Creation**: Create snippets without visiting the website
- **Selected Text Detection**: Automatically capture selected text from web pages
- **Language Auto-detection**: Detect programming language based on file extensions
- **All Snippet Options**: Support for expiration, view limits, password protection
- **Owner Code Management**: Receive and securely store owner codes for editing/deleting snippets
- **History Tracking**: Keep track of recently created snippets

### Installation

1. Navigate to the `codin/` directory
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `codin/` folder

### Usage

1. Click the CodeDrop extension icon in Chrome
2. The extension will automatically detect selected text on the current page
3. Configure snippet options (title, language, expiration, etc.)
4. Click "Create Snippet" 
5. **Copy the Owner Code**: The extension displays both the snippet URL and owner code
6. Keep the owner code secure - it's needed for editing or deleting the snippet

### Owner Code Security

⚠️ **Important**: The owner code is displayed only once after creation. Anyone with this code can edit or delete your snippet. Store it securely if you plan to modify the snippet later.

### API Integration

The extension communicates with the CodeDrop API at `https://codin.site/api/create` and receives:
- `shortId`: The snippet identifier for the URL
- `ownerCode`: The code needed for editing/deleting (format: `OWN-XXXXXXXXX`)

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install` or `pnpm install`
3. Set up environment variables for Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Update database schema using the migration script:
   ```sql
   -- Run the SQL commands in database-migration.sql
   ALTER TABLE pastes ADD COLUMN owner_code VARCHAR(32);
   ```
5. Run the development server: `npm run dev`

## Deployment

The application is deployed on Vercel:
- URL: https://vercel.com/tungnts-projects-2459d5aa/v0-code-drop-ui-design

## Future Enhancements

### Security Improvements
- Rate limiting for code verification attempts
- IP-based access logging
- Optional email notifications for edits/deletes
- Two-factor authentication for sensitive operations

### User Experience
- Snippet versioning (keep last 3 versions)
- Bulk operations for owners with multiple snippets
- QR codes for easy mobile access
- Collection/grouping functionality

### Advanced Features
- REST API for programmatic access
- Webhook notifications for snippet changes
- Comment system for collaborative snippets
- Team sharing with shared owner codes

## License

This project is licensed under the MIT License - see the LICENSE file for details. 