# CodeDrop - Code Snippet Sharing Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tungnts-projects-2459d5aa/v0-code-drop-ui-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/SiJCerzL7zY)

CodeDrop is a modern code snippet sharing platform with a simple owner-based management system. Create, share, and manage your code snippets using a secure owner code - no account required!

![CodeDrop Screenshot](public/screenshot.png)

## Features

- **Create Code Snippets**: Easy-to-use interface for creating code snippets
- **Syntax Highlighting**: Support for 20+ programming languages with auto-detection
- **Owner Management**: Simple code-based system for editing and deleting snippets
- **Expiration Settings**: Set snippets to expire after a specified time
- **View Limits**: Limit the number of times a snippet can be viewed
- **Password Protection**: Secure your snippets with password protection
- **Browser Extension**: Create snippets directly from your browser
- **No Registration**: Use the platform without creating an account

## Owner Management System

When you create a snippet, you receive a single owner code:

- **🔑 Owner Code** (`OWN-ABC123DEF`): Full access to edit and delete your snippet

**⚠️ Important**: Save this code securely! It is shown only once and cannot be recovered.

## How It Works

1. **Create a Snippet**: Enter your code, select language, set options
2. **Get Your Owner Code**: Receive a unique 12-character code
3. **Share the Link**: Send the snippet URL to others
4. **Manage Later**: Use Edit/Delete buttons and enter your owner code when prompted

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/codedrop.git
   cd codedrop
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   Run the migration script in your Supabase database:
   ```bash
   # Run the SQL commands in database-migration.sql
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## User Interface

- **Snippet View**: Clean display with syntax highlighting and theme options
- **Edit/Delete Buttons**: Always visible in the snippet toolbar
- **Owner Code Modal**: Secure popup for code verification
- **Edit Interface**: Full-featured editor with change tracking
- **One-Time Code Display**: Owner code shown only once after creation

## Browser Extension

The browser extension is located in the `codin/` directory. To install it:

1. Go to Chrome Extensions page (`chrome://extensions/`)
2. Enable Developer Mode
3. Click "Load unpacked" and select the `codin/` directory

## API Documentation

For complete API documentation and technical details, see [DOCUMENTATION.md](DOCUMENTATION.md).

## Contributing

We welcome contributions! Please see our contributing guidelines and code of conduct.

## Security

- Owner codes are hashed using bcrypt before storage
- No personal information is collected or stored
- Snippets are automatically deleted when expired or view limits are reached
- One-time code display prevents accidental exposure

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)
- Syntax highlighting by [react-syntax-highlighter](https://react-syntax-highlighter.github.io/react-syntax-highlighter/)
