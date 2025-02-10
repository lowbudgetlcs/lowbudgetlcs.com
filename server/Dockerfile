FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev 

COPY . .
RUN npx tsc

EXPOSE 8080
ENV NODE_ENV production
CMD [ "npm", "run", "start" ]
