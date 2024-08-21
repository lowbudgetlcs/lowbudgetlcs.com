FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

#EXPOSE 3000 IDK WHAT PORT THIS USES (PROBABLY 8080?)

# CMD [ "serve", "-s", "dist" ] IDK HOW TO RUN THIS APP
