# Multi-stage build for Next.js application

#######################
# 1. Base image
#######################
FROM node:20-alpine AS base

#######################
# 2. Dependencies stage
#######################
FROM base AS deps

# Add compatibility libs
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

#######################
# 3. Builder stage
#######################
FROM base AS builder

WORKDIR /app

# Reuse node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy all app source
COPY . .

# 🔹 Build-time public API URL for Next.js (used in npm run build)
ARG NEXT_PUBLIC_SERVER_URI
ENV NEXT_PUBLIC_SERVER_URI=$NEXT_PUBLIC_SERVER_URI

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js app (standalone output)
RUN npm run build

#######################
# 4. Runner (production) stage
#######################
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 🔹 Expose same env at runtime (useful for debugging / SSR)
ARG NEXT_PUBLIC_SERVER_URI
ENV NEXT_PUBLIC_SERVER_URI=$NEXT_PUBLIC_SERVER_URI

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Prepare .next directory (for static files)
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone build output
# Next.js standalone output includes server.js and required files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# App listens on 3000 inside the container
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js standalone server
CMD ["node", "server.js"]