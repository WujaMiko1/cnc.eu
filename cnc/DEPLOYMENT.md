# Deployment Guide - Render.com

## Prerequisites

1. A GitHub account with this repository
2. A Render.com account
3. PostgreSQL database access

## Step-by-Step Deployment

### 1. Prepare Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial production monitoring system"
   git push origin main
   ```

### 2. Set Up Database

1. In Render Dashboard, create a new PostgreSQL database:
   - Name: `production-monitoring-db`
   - Database Name: `production_monitoring`
   - User: `production_user`

2. Copy the connection string (DATABASE_URL)

### 3. Deploy Web Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure settings:
   - **Name**: `production-monitoring`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18 or higher

### 4. Environment Variables

Add these environment variables in Render:

- `NODE_ENV`: `production`
- `DATABASE_URL`: [Your PostgreSQL connection string]

### 5. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Database schema will be created on first run

## Automatic Deployment

The `render.yaml` file in the repository root enables automatic deployment:
- Database and web service are configured together
- Environment variables are automatically linked
- Deployments trigger on every git push to main branch

## Production URLs

After deployment, your application will be available at:
- `https://production-monitoring.onrender.com` (or your custom domain)

## Monitoring

- Check logs in Render Dashboard
- Monitor database performance
- Set up health checks if needed

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Database Connection**: Verify DATABASE_URL is correct
3. **Port Issues**: Render automatically sets PORT environment variable

### Support

- Render Documentation: https://render.com/docs
- GitHub Issues: Create issues in your repository for bugs

## Scaling

- Render automatically handles scaling for web services
- Database can be upgraded for better performance
- Consider Redis for session storage in high-traffic scenarios