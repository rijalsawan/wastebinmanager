# Deployment Guide - WasteBin

Complete guide for deploying the WasteBin application to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Production build successful
- [ ] Security review completed

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Prerequisites
- Vercel account
- GitHub repository
- PostgreSQL database (Neon, Supabase, or Vercel Postgres)

#### Steps

1. **Prepare Database**
   ```bash
   # Use a managed PostgreSQL service
   # Recommended: Neon (free tier available)
   # Get connection string from provider
   ```

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     ```
     DATABASE_URL=<your-postgres-url>
     AUTH_SECRET=<generate-with-openssl-rand-base64-32>
     AUTH_URL=https://your-app.vercel.app
     ```
   - Deploy!

4. **Run Migrations**
   ```bash
   # After deployment, run in your terminal
   DATABASE_URL=<production-url> npx prisma migrate deploy
   DATABASE_URL=<production-url> npx prisma db seed
   ```

#### Vercel Postgres (Integrated Option)

1. In Vercel dashboard, go to "Storage" → "Create Database"
2. Select "Postgres"
3. Vercel will auto-inject `DATABASE_URL`
4. Use Vercel CLI to run migrations:
   ```bash
   vercel env pull
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

### Option 2: Docker + AWS/DigitalOcean

#### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Update next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Add this for Docker
};

export default nextConfig;
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: wastebin
      POSTGRES_PASSWORD: wastebin123
      POSTGRES_DB: wastebin
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://wastebin:wastebin123@postgres:5432/wastebin
      AUTH_SECRET: your-secret-key-here
      AUTH_URL: http://localhost:3000
    depends_on:
      - postgres
    command: >
      sh -c "
        npx prisma migrate deploy &&
        npx prisma db seed &&
        node server.js
      "

volumes:
  postgres_data:
```

#### Build and Run

```bash
# Build image
docker-compose build

# Run
docker-compose up -d

# Check logs
docker-compose logs -f app
```

---

### Option 3: Traditional VPS (Ubuntu)

#### Prerequisites
- Ubuntu 22.04 server
- Domain name (optional)
- SSL certificate (Let's Encrypt)

#### Steps

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PostgreSQL**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Setup Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE wastebin;
   CREATE USER wastebin WITH ENCRYPTED PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE wastebin TO wastebin;
   \q
   ```

4. **Clone & Setup**
   ```bash
   cd /var/www
   git clone <your-repo>
   cd wastebin
   npm install
   ```

5. **Configure Environment**
   ```bash
   nano .env
   ```
   Add:
   ```
   DATABASE_URL="postgresql://wastebin:your-password@localhost:5432/wastebin"
   AUTH_SECRET="your-secret-key"
   AUTH_URL="https://yourdomain.com"
   ```

6. **Run Migrations**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

7. **Build**
   ```bash
   npm run build
   ```

8. **Setup PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name wastebin -- start
   pm2 startup
   pm2 save
   ```

9. **Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/wastebin
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/wastebin /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **SSL with Let's Encrypt**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```

---

## 🔐 Security Best Practices

### Environment Variables
```bash
# Generate secure AUTH_SECRET
openssl rand -base64 32
```

### Database Security
- Use strong passwords
- Enable SSL connections in production
- Regular backups
- Restrict network access

### Application Security
- [ ] HTTPS only in production
- [ ] Secure headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Environment variables never committed

---

## 📊 Monitoring

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### PM2 Monitoring (VPS)
```bash
pm2 monit
pm2 logs wastebin
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Vercel)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🗄️ Database Backup

### Automated Backups (Cron)
```bash
# Create backup script
nano /home/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/backups"
DB_NAME="wastebin"

pg_dump $DB_NAME > $BACKUP_DIR/wastebin_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "wastebin_*.sql" -mtime +7 -delete
```

```bash
chmod +x /home/backup-db.sh
crontab -e
# Add: 0 2 * * * /home/backup-db.sh
```

---

## 🚨 Rollback Procedure

### Vercel
```bash
# Instant rollback via dashboard
# Or use CLI
vercel rollback
```

### PM2
```bash
git reset --hard HEAD^
npm install
npm run build
pm2 restart wastebin
```

---

## 📈 Performance Optimization

### Production Checklist
- [ ] Enable compression in Next.js
- [ ] Image optimization configured
- [ ] Database connection pooling
- [ ] CDN for static assets
- [ ] Caching strategy implemented

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_bins_category ON "Bin"(category);
CREATE INDEX idx_bins_status ON "Bin"(status);
CREATE INDEX idx_requests_status ON "Request"(status);
CREATE INDEX idx_requests_user ON "Request"("userId");
```

---

## 🎯 Post-Deployment

1. **Test All Features**
   - [ ] Login/Signup
   - [ ] Bins CRUD
   - [ ] IoT Simulation
   - [ ] Reports page
   - [ ] Requests system

2. **Monitor Performance**
   - Check response times
   - Monitor database queries
   - Review error logs

3. **Setup Alerts**
   - Downtime monitoring
   - Error tracking (Sentry)
   - Performance degradation

---

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs` or Vercel dashboard
2. Review environment variables
3. Verify database connection
4. Check migration status

---

**Happy Deploying! 🚀**
