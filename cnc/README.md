# System Monitorowania Produkcji

Professional production monitoring application with advanced analytics, real-time machine monitoring, and comprehensive CSV export capabilities.

## Features

- **Daily Work Overview** - Comprehensive time tracking and productivity analysis
- **Real-time Machine Monitoring** - Live status updates, position tracking, and performance metrics
- **Program Monitoring** - Detailed production program tracking with status management
- **CSV Export** - Configurable data export with custom formatting options
- **Modern UI** - Dark theme with navy/black/white color scheme optimized for industrial environments

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Render.com ready with automatic builds

## Quick Start

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file with:
   DATABASE_URL=your_postgresql_connection_string
   ```

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Production Deployment (Render.com)

1. Connect your GitHub repository to Render
2. The `render.yaml` file will automatically configure the deployment
3. Set the `DATABASE_URL` environment variable in your Render dashboard
4. Deploy automatically triggers on git push

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
- `NODE_ENV` - Environment mode (development/production)

## Database Schema

The application uses two main tables:
- `users` - User authentication and management
- `production_programs` - Core production data with time tracking

## API Endpoints

- `GET /api/production-stats` - Production statistics
- `GET /api/production-programs` - Program listings
- `GET /api/machines` - Machine status and monitoring
- `POST /api/export/csv` - CSV data export

## License

MIT License