FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/shared-utils/package.json packages/shared-utils/
COPY apps/server/package.json apps/server/
RUN npm install --omit=dev --workspace=apps/server --workspace=packages/shared-types --workspace=packages/shared-utils

COPY packages/ packages/
COPY apps/server/ apps/server/

RUN npm run build -w packages/shared-types && \
    npm run build -w packages/shared-utils && \
    npm run build -w apps/server

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "apps/server/dist/index.js"]
