FROM node:18-alpine as build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ARG VITE_PLAYERS_URL
ARG VITE_TEAMS_URL
ARG VITE_DIVISIONS_URL

ENV VITE_PLAYERS_URL=$VITE_PLAYERS_URL
ENV VITE_TEAMS_URL=$VITE_TEAMS_URL
ENV VITE_DIVISIONS_URL=$VITE_DIVISIONS_URL

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]