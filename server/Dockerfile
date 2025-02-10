FROM node:18-alpine 

WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npx tsc && npm prune --production

EXPOSE 8080
ENV NODE_ENV=production
CMD [ "npm", "run", "start" ]
