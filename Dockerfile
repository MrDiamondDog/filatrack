# syntax=docker.io/docker/dockerfile:1

FROM node:25-alpine AS base

# Install python/pip (required for some node-gyp)
ENV PYTHONUNBUFFERED=1
RUN apk add --no-cache python3 && ln -sf python3 /usr/bin/python

# Install pkg-config for node-gyp
RUN apk --no-cache add pkgconf pixman-dev cairo-dev cairo pango-dev jpeg-dev build-base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g corepack -f
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g corepack -f
RUN corepack enable pnpm
RUN pnpm run build-types
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 filatrack

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=filatrack:nodejs /app/.next/standalone ./
COPY --from=builder --chown=filatrack:nodejs /app/.next/static ./.next/static

USER filatrack

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]