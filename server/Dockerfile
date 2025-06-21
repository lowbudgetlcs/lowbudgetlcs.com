FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json .
RUN npm install --frozen-lockfile
COPY ./ ./
RUN npx tsc && npm prune --production

ENV NODE_ENV=production
CMD [ "npm", "run", "start" ]
