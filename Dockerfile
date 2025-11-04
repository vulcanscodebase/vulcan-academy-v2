# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Verify next.config.mjs exists and has standalone output
RUN cat next.config.mjs | grep -q "standalone" || (echo "ERROR: next.config.mjs missing standalone output config" && exit 1)

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application with verbose output
RUN npm run build || (echo "Build command failed" && exit 1)

# Verify that the standalone output was created
RUN ls -la /app/.next/ || (echo "ERROR: .next directory not found after build" && exit 1)
RUN test -d /app/.next/standalone || (echo "ERROR: standalone directory not found. Listing .next contents:" && ls -la /app/.next/ && echo "Checking for build errors above..." && exit 1)
RUN echo "Build verification: standalone directory exists" && ls -la /app/.next/standalone/ | head -20

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
# Copy the standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

