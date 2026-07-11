FROM node:20-alpine
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build -w packages/shared-types && \
    npm run build -w packages/shared-utils && \
    npm run build -w apps/server

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "apps/server/dist/index.js"]
