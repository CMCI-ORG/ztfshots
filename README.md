# Daily Dose from Z.T. Fomum

A comprehensive web application for managing and sharing inspirational quotes from Z.T. Fomum, featuring multi-language support, user engagement tracking, and administrative capabilities.

## 🌟 Features

### Quote Management
- Create, edit, and delete quotes with rich text support
- Organize quotes by authors and categories
- Schedule quote publications
- Track quote engagement metrics
- Multi-language translations support
- Source attribution and linking

### User Features
- User authentication and profile management
- Quote interactions (like, star, share)
- Comment on quotes
- Download shareable quote cards
- Language preference settings
- Email and WhatsApp notifications

### Admin Dashboard
- Comprehensive analytics and metrics
- User management
- Content moderation
- Translation management
- System settings configuration
- WhatsApp template management

### Internationalization
- Multi-language interface
- Content translation management
- Browser language detection
- User language preferences
- RTL support

## 🛠 Tech Stack

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner

### Backend (Supabase)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Edge Functions**: Deno Runtime
- **Email Service**: Resend

## 📦 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   │   ├── dashboard/   # Analytics and metrics
│   │   ├── languages/   # Translation management
│   │   └── settings/    # System configuration
│   ├── auth/            # Authentication components
│   ├── client-portal/   # Public-facing components
│   ├── layout/          # Layout components
│   ├── quotes/          # Quote management
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
├── pages/              # Page components
├── providers/          # Context providers
├── routes/             # Route configurations
└── utils/              # Utility functions
```

## 🗄️ Database Schema

### Core Tables
- `quotes`: Main quotes storage
- `authors`: Quote authors
- `categories`: Quote categories
- `sources`: Quote sources
- `languages`: Supported languages

### User-Related Tables
- `profiles`: User profiles
- `comments`: Quote comments
- `quote_likes`: Quote likes
- `quote_stars`: Quote favorites
- `quote_shares`: Share tracking

### Analytics Tables
- `analytics_events`: User events
- `visitor_analytics`: Visit tracking
- `demographic_analytics`: User demographics

## 🔒 Security

### Row Level Security (RLS)
- Public read access for published content
- Authenticated user access for interactions
- Admin-only access for sensitive operations
- Role-based access control

### Data Protection
- Input validation with Zod
- SQL injection prevention
- XSS protection
- Rate limiting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account
- Resend account (for emails)

### Development Setup

1. Clone and install dependencies:
```bash
git clone <repository-url>
cd daily-dose-ztf
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Fill in your Supabase and other API keys
```

3. Start development server:
```bash
npm run dev
```

### Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `RESEND_API_KEY`: Resend API key for emails
- `WHATSAPP_API_TOKEN`: WhatsApp API token
- `WHATSAPP_PHONE_ID`: WhatsApp phone number ID

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Fluid typography
- Mobile-first design
- Responsive navigation
- Touch-friendly interactions
- Optimized layouts for all screen sizes

## 🔄 State Management

### TanStack Query
- Server state management
- Automatic background updates
- Optimistic updates
- Infinite scrolling
- Prefetching

### React Context
- User authentication state
- Language preferences
- Theme settings
- UI state

## 🌐 Internationalization

### Features
- Dynamic language switching
- Content translation
- RTL support
- Date/time formatting
- Number formatting

### Translation Management
- Admin interface for translations
- Bulk import/export
- Translation status tracking
- Version control

## 📊 Analytics

### Tracked Metrics
- User engagement
- Quote popularity
- Geographic distribution
- Device statistics
- Performance metrics

### Reports
- Daily/weekly/monthly trends
- User growth
- Content engagement
- Translation coverage

## 🔧 Maintenance

### Regular Tasks
- Database backups
- Log rotation
- Cache clearing
- Performance monitoring
- Security updates

### Monitoring
- Error tracking
- Performance metrics
- User feedback
- System health

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation
- Follow the existing code style

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support:
- GitHub Issues
- Email Support
- Documentation
- Community Forums

## 🔜 Roadmap

See our [public roadmap](./ROADMAP.md) for upcoming features and improvements.