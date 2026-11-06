FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY ./ ./
RUN npx tsc && npm prune --production

FROM node:20-alpine AS prod
RUN addgroup -g 1001 -S nodejs &&\
  adduser -S nodejs -u 1001
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN chown -R nodejs:nodejs /app
USER nodejs
ENV NODE_ENV=production
CMD [ "npm", "run", "start" ]
