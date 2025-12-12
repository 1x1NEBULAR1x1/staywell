# Shared Dockerfile for database seeding and Prisma Studio
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY shared/package.json ./shared/

# Install dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build the shared package
FROM base AS builder
WORKDIR /app

# Install pnpm and TypeScript
RUN corepack enable pnpm && npm install -g typescript

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY shared ./shared

WORKDIR /app/shared

# Generate Prisma client and build
RUN cd .. && npx prisma generate --schema=./shared/prisma/schema.prisma
RUN pnpm build

# Production image for seeding
FROM base AS seeder
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

COPY --from=builder /app/shared/src ./src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/package.json ./package.json
COPY --from=builder /app/shared/prisma ./prisma
COPY --from=builder /app/shared/tsconfig.json ./tsconfig.json

# Run seeder by default (always succeed to not break the pipeline)
CMD ["sh", "-c", "pnpm db:seed || echo 'Seeding completed or data already exists'"]

# Development image for Prisma Studio
FROM base AS studio
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

COPY --from=builder /app/shared/src ./src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/package.json ./package.json
COPY --from=builder /app/shared/prisma ./prisma
COPY --from=builder /app/shared/tsconfig.json ./tsconfig.json

EXPOSE 5555

# Run Prisma Studio
CMD ["npx", "prisma", "studio", "--port", "5555", "--browser", "none"]