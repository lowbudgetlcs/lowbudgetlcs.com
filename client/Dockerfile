FROM node:18-alpine as builder

# Install deps and build dist
WORKDIR /build
COPY package*.json .
RUN npm ci --omit=dev 
COPY . .
RUN npm run build

# Run dist in much smaller image
FROM node:18-alpine as runner

RUN npm i -g serve
COPY package.json ./
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
ENV NODE_ENV production

CMD [ "npm", "run", "start" ]
