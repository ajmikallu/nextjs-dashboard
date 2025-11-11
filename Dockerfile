# ============================================
# Stage 1: DEPENDENCIES
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile


# ============================================
# Stage 2: DEVELOPMENT IMAGE
# ============================================
# For local development - runs 'next dev' instead of building
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

# Install pnpm
RUN npm install -g pnpm

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy entire project
COPY . .

EXPOSE 3000

# Run development server (hot reload, no build needed)
# This is perfect for learning Docker locally
CMD ["pnpm", "run", "dev"]