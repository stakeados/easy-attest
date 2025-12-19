# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Declare build arguments
ARG NEXT_PUBLIC_EAS_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS
ARG NEXT_PUBLIC_PAYMASTER_URL
ARG NEXT_PUBLIC_RPC_URL
ARG NEXT_PUBLIC_RPC_URL_SEPOLIA
ARG NEXT_PUBLIC_WC_PROJECT_ID
ARG NEXT_PUBLIC_ONCHAINKIT_API_KEY
ARG NEXT_PUBLIC_SUBGRAPH_URL

# Make them available during build time
ENV NEXT_PUBLIC_EAS_CONTRACT_ADDRESS=$NEXT_PUBLIC_EAS_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS=$NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS
ENV NEXT_PUBLIC_PAYMASTER_URL=$NEXT_PUBLIC_PAYMASTER_URL
ENV NEXT_PUBLIC_RPC_URL=$NEXT_PUBLIC_RPC_URL
ENV NEXT_PUBLIC_RPC_URL_SEPOLIA=$NEXT_PUBLIC_RPC_URL_SEPOLIA
ENV NEXT_PUBLIC_WC_PROJECT_ID=$NEXT_PUBLIC_WC_PROJECT_ID
ENV NEXT_PUBLIC_ONCHAINKIT_API_KEY=$NEXT_PUBLIC_ONCHAINKIT_API_KEY
ENV NEXT_PUBLIC_SUBGRAPH_URL=$NEXT_PUBLIC_SUBGRAPH_URL

# Build the project
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy scripts for runtime env generation
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Generate env-config.js at runtime using system env vars, then start the server
CMD ["sh", "-c", "node scripts/generate-env.js && node server.js"]
