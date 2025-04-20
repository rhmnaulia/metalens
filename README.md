# MetaLens

A metadata inspection tool that helps you analyze your website's metadata, social cards, and technical tags in real-time.

## Features

- 🔍 Comprehensive metadata inspection
  - Title, description, and keywords analysis
  - Open Graph protocol support
  - Twitter Cards integration
  - Facebook verification tags
  - Discord and Slack link previews
- 🛠️ Technical metadata analysis
  - Canonical URL verification
  - Robots meta directives
  - Language and viewport settings
  - Character encoding detection
  - Favicon and touch icons validation
- 📱 Modern UI Features
  - Mobile-responsive design
  - Dark mode support
  - Real-time metadata updates
  - Copy to JSON functionality
  - Image preview capabilities

## Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript 5
- **UI**:
  - Tailwind CSS 4
  - shadcn/ui components
  - Radix UI primitives
- **State Management**: TanStack Query v5
- **Icons**: Lucide Icons
- **Development Tools**:
  - ESLint 9
  - PostCSS
  - Turbopack (for development)

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── page.tsx        # Main application page
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── metadata-section.tsx
│   ├── metadata-field.tsx
│   └── image-preview.tsx
├── hooks/             # Custom React hooks
│   └── use-metadata.ts
└── lib/               # Utility functions
    ├── metadata.ts    # Metadata processing
    ├── utils.ts       # Helper functions
    └── constants.ts   # Application constants
```

## Development

### Prerequisites

- Node.js 20.x or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rhmnaulia/metalens.git
   cd metalens
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

The application includes the following API endpoints:

- `/api/metadata` - Fetches and analyzes metadata from a given URL
- Additional endpoints for specific metadata types and analysis

## Architecture

MetaLens is built with a modern, component-based architecture:

- **Frontend**: Next.js with App Router for server-side rendering and API routes
- **State Management**: React Query for efficient data fetching and caching
- **UI Components**: Modular components built with Radix UI primitives and shadcn/ui
- **Metadata Processing**: Server-side metadata extraction and analysis
- **Styling**: Tailwind CSS for utility-first styling with custom animations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- **Aulia Rahman**
  - GitHub: [@rhmnaulia](https://github.com/rhmnaulia)
  - Twitter: [@rhmnaul](https://twitter.com/rhmnaul)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TanStack Query](https://tanstack.com/query/latest)
