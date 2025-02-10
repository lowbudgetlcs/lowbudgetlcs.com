FROM node:18-alpine AS builder

# Install deps and build dist
WORKDIR /build
COPY package*.json .
RUN npm i 
COPY . .
RUN npm run build && npm prun --production

# Run dist in much smaller image
FROM node:18-alpine AS runner

RUN npm i -g serve
COPY --from=builder /build/package.json ./
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
ENV NODE_ENV=production

CMD [ "npm", "run", "start" ]
