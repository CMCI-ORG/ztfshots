# Daily Dose from Z.T. Fomum

A web application for sharing and managing inspirational quotes from Z.T. Fomum.

## Project Overview

This application serves as a platform for managing and sharing inspirational quotes. It includes features for:

- Quote management (CRUD operations)
- Author and category organization
- User subscriptions for daily quotes
- Analytics dashboard
- Email notifications system

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase
  - Authentication
  - PostgreSQL Database
  - Edge Functions
  - Storage

## Getting Started

### Prerequisites

- Node.js 18+ (recommended to install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm 9+

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── admin/         # Admin dashboard components
│   ├── quotes/        # Quote-related components
│   └── ui/            # shadcn/ui components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── integrations/      # External service integrations
│   └── supabase/     # Supabase client and types
└── utils/            # Utility functions
```

## Key Features

### Admin Dashboard

The admin dashboard (`/admin`) provides:
- Quote management interface
- Subscriber management
- Analytics and metrics
- Site settings configuration

### Quote Management

- Create, edit, and delete quotes
- Organize quotes by authors and categories
- Schedule quote publications
- Track quote engagement

### Subscription System

- Email subscription management
- Daily quote notifications
- Weekly digest emails
- Subscriber analytics

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team or raise an issue in the project repository.