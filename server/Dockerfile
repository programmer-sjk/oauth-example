FROM node:12

MAINTAINER JeongKuk Seo <wjdrnr6662@gmail.com>

WORKDIR /app
COPY /source/package*.json /app/
RUN npm install

COPY source/ .
CMD [ "npm", "start"]
