FROM node:lts-alpine
MAINTAINER JeongKuk Seo <wjdrnr6662@gmail.com>

WORKDIR /app
COPY source/package*.json /app/
RUN npm install

COPY source/ .

EXPOSE 8080
CMD ["npm", "start"]
