FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

#IDK WHAT PORT THIS USES (PROBABLY 8080?)
EXPOSE 8080

#IDK HOW TO RUN THIS APP
CMD [ "npm", "run", "start" ]
