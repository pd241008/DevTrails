# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the Next.js application
# Environment variables like NEXT_PUBLIC_BACKEND_URL must be provided during build if you're using static generation
# For this demo, we'll assume it's provided as a build arg or runtime env for simplicity in client-side fetch
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the built application and dependencies
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the default Next.js port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
