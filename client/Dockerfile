FROM node:22-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY ./ ./
RUN npm run build 

# Run dist in much smaller image
FROM nginx:stable-alpine AS prod 

WORKDIR /usr/share/nginx/

COPY --from=builder /usr/src/app/nginx /etc/nginx/conf.d
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/
ENV NODE_ENV=production
EXPOSE 443

CMD [ "nginx", "-g", "daemon off;" ]
