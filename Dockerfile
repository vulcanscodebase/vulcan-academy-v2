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

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ---- BUILD-TIME ARGS (PUBLIC + SECRET) ----
ARG NEXT_PUBLIC_SERVER_URI
ARG ASSEMBLYAI_API_KEY
ARG OPENROUTER_API_KEY
ARG GOOGLE_GENERATIVE_AI_API_KEY
ARG AZURE_SPEECH_KEY
ARG AZURE_SPEECH_REGION

# Make env available to Next.js during build
ENV NEXT_PUBLIC_SERVER_URI=$NEXT_PUBLIC_SERVER_URI
ENV ASSEMBLYAI_API_KEY=$ASSEMBLYAI_API_KEY
ENV OPENROUTER_API_KEY=$OPENROUTER_API_KEY
ENV GOOGLE_GENERATIVE_AI_API_KEY=$GOOGLE_GENERATIVE_AI_API_KEY
ENV AZURE_SPEECH_KEY=$AZURE_SPEECH_KEY
ENV AZURE_SPEECH_REGION=$AZURE_SPEECH_REGION

ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js standalone output
RUN npm run build

#######################
# 4. Runner (production) stage
#######################
FROM base AS runner

WORKDIR /app

# Install system libraries required by Azure Speech SDK
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# (Optional) expose env at runtime for debugging
ARG NEXT_PUBLIC_SERVER_URI
ARG ASSEMBLYAI_API_KEY
ARG OPENROUTER_API_KEY
ARG GOOGLE_GENERATIVE_AI_API_KEY
ARG AZURE_SPEECH_KEY
ARG AZURE_SPEECH_REGION

ENV NEXT_PUBLIC_SERVER_URI=$NEXT_PUBLIC_SERVER_URI
ENV ASSEMBLYAI_API_KEY=$ASSEMBLYAI_API_KEY
ENV OPENROUTER_API_KEY=$OPENROUTER_API_KEY
ENV GOOGLE_GENERATIVE_AI_API_KEY=$GOOGLE_GENERATIVE_AI_API_KEY
ENV AZURE_SPEECH_KEY=$AZURE_SPEECH_KEY
ENV AZURE_SPEECH_REGION=$AZURE_SPEECH_REGION

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
