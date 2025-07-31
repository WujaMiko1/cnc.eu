# Production Monitoring System

## Overview

This is a full-stack production monitoring application built with React, Express, and PostgreSQL. The system provides real-time monitoring and analysis of production programs with comprehensive dashboard features, data visualization, and CSV export capabilities. The application is designed for industrial production environments requiring detailed time tracking and performance analysis.

## User Preferences

Preferred communication style: Simple, everyday language.
Visual design: Professional black, white, and navy color scheme inspired by industrial interfaces.
Navigation: Collapsible sidebar navigation (removed main dashboard).
Focus: Daily work overview and time analysis as primary interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization
- **Design System**: Dark theme with cyan accent colors, neutral base

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Pattern**: RESTful API with structured error handling
- **Development**: Hot-reloading with Vite integration

### Build System
- **Bundler**: Vite for frontend development and building
- **Deployment**: ESBuild for backend production builds
- **Package Manager**: npm with lockfile version 3

## Key Components

### Database Schema
The system uses two main tables:
- **users**: Basic user authentication with username/password
- **production_programs**: Core production data tracking work time, idle time, emergency time, and program status

### Production Program Entity
- Tracks program names, start/end dates, and time measurements in seconds
- Supports status tracking (running, completed successfully, emergency)
- Includes audit trails with creation timestamps

### Dashboard Features
- **Stats Overview**: Real-time KPI cards showing total work time, idle time, emergency time, and efficiency metrics
- **Date Range Filtering**: Flexible date selection with preset options (today, week, month)
- **Data Visualization**: Bar charts for daily productivity and pie charts for time distribution
- **Production Table**: Paginated table with search, sorting, and detailed program information
- **CSV Export**: Configurable export with field selection, time format options, and separator choices

### UI Components
- Responsive sidebar navigation with mobile support
- Dark theme optimized for industrial environments
- Toast notifications for user feedback
- Loading states and error handling
- Accessible form controls and data tables

## Data Flow

1. **Production Data Ingestion**: Programs are created/updated through REST API endpoints
2. **Real-time Monitoring**: Dashboard components fetch data using TanStack Query with automatic caching
3. **Data Processing**: Time calculations and efficiency metrics computed on the server
4. **Visualization**: Charts and tables render filtered data based on user-selected date ranges
5. **Export**: CSV generation happens server-side with configurable formatting options

## External Dependencies

### Database Integration
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Connection Pooling**: Built-in connection management for production scalability

### UI/UX Libraries
- **Radix UI**: Accessible primitive components for complex UI patterns
- **Lucide React**: Consistent icon system
- **date-fns**: Date manipulation and formatting utilities
- **Recharts**: Production-ready charting library

### Development Tools
- **Replit Integration**: Development environment optimizations
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code formatting and quality (implied by project structure)

## Deployment Strategy

### Development Mode
- Frontend served by Vite dev server with HMR
- Backend runs with tsx for TypeScript execution
- Database schema changes applied via `drizzle-kit push`

### Production Build
- Frontend built to static assets in `dist/public`
- Backend bundled as single ESM file with external dependencies
- Environment variables required: `DATABASE_URL`

### Hosting Considerations
- Static frontend can be served by Express in production
- Database migrations managed through Drizzle Kit
- Session storage configured for PostgreSQL (connect-pg-simple)

The architecture prioritizes developer experience with hot-reloading, type safety, and modern tooling while maintaining production readiness with proper error handling, database optimization, and scalable deployment patterns.