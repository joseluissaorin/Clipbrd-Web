#!/bin/bash

# Exit on error
set -e

# Configuration
DEPLOY_ENV=${1:-production}
DEPLOY_BRANCH="main"
APP_NAME="clipbrd"
DEPLOY_USER="deploy"
DEPLOY_HOST="clipbrdapp.com"
DEPLOY_PATH="/var/www/clipbrd"
BACKUP_PATH="/var/backups/clipbrd"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check deployment environment
if [ "$DEPLOY_ENV" != "production" ] && [ "$DEPLOY_ENV" != "staging" ]; then
    error "Invalid deployment environment. Use 'production' or 'staging'"
fi

# Verify we're on the correct branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$DEPLOY_BRANCH" ]; then
    error "Must deploy from $DEPLOY_BRANCH branch. Current branch: $CURRENT_BRANCH"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    error "Working directory not clean. Commit or stash changes first."
fi

# Run tests
log "Running tests..."
npm run test:ci || error "Tests failed"

# Build application
log "Building application..."
npm run build || error "Build failed"

# Create deployment archive
log "Creating deployment archive..."
DEPLOY_ARCHIVE="deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
git archive --format=tar.gz -o "$DEPLOY_ARCHIVE" HEAD || error "Failed to create deployment archive"

# Create database backup
log "Creating database backup..."
ssh $DEPLOY_USER@$DEPLOY_HOST "mkdir -p $BACKUP_PATH && \
    pg_dump -Fc clipbrd > $BACKUP_PATH/pre-deploy-$(date +%Y%m%d-%H%M%S).dump" || \
    error "Database backup failed"

# Upload deployment archive
log "Uploading deployment archive..."
scp "$DEPLOY_ARCHIVE" $DEPLOY_USER@$DEPLOY_HOST:/tmp/ || error "Failed to upload deployment archive"

# Deploy
log "Deploying application..."
ssh $DEPLOY_USER@$DEPLOY_HOST bash -c "'
    set -e
    
    # Stop application
    pm2 stop $APP_NAME || true
    
    # Create deployment directory
    mkdir -p $DEPLOY_PATH
    cd $DEPLOY_PATH
    
    # Extract new version
    tar xzf /tmp/$DEPLOY_ARCHIVE
    
    # Install dependencies
    npm ci --production
    
    # Run database migrations
    npx supabase db push
    
    # Update environment variables
    cp /etc/clipbrd/.env.production .env.local
    
    # Build application
    npm run build
    
    # Update permissions
    chown -R $DEPLOY_USER:$DEPLOY_USER .
    
    # Start application
    pm2 start $APP_NAME
    
    # Cleanup
    rm /tmp/$DEPLOY_ARCHIVE
'" || error "Deployment failed"

# Verify deployment
log "Verifying deployment..."
curl -f -s https://$DEPLOY_HOST/api/health || error "Health check failed"

# Cleanup local archive
rm "$DEPLOY_ARCHIVE"

log "Deployment completed successfully!"

# Post-deployment tasks
log "Running post-deployment tasks..."

# Invalidate CDN cache
if [ "$DEPLOY_ENV" = "production" ]; then
    log "Invalidating CDN cache..."
    aws cloudfront create-invalidation --distribution-id $CDN_DISTRIBUTION_ID --paths "/*"
fi

# Send notification
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Successfully deployed $APP_NAME to $DEPLOY_ENV\"}" \
        $SLACK_WEBHOOK_URL
fi

log "All done! 🎉" 