FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/shared-utils/package.json packages/shared-utils/
COPY apps/server/package.json apps/server/
RUN npm install --workspace=apps/server --workspace=packages/shared-types --workspace=packages/shared-utils

# Copy source
COPY packages/ packages/
COPY apps/server/ apps/server/

# Build shared packages and server
RUN npm run build -w packages/shared-types
RUN npm run build -w packages/shared-utils
RUN npm run build -w apps/server

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=base /app/packages/shared-types/package.json ./packages/shared-types/
COPY --from=base /app/packages/shared-utils/dist ./packages/shared-utils/dist
COPY --from=base /app/packages/shared-utils/package.json ./packages/shared-utils/
COPY --from=base /app/apps/server/dist ./apps/server/dist
COPY --from=base /app/apps/server/package.json ./apps/server/
COPY --from=base /app/packages/ ./packages/

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "apps/server/dist/apps/server/src/index.js"]
