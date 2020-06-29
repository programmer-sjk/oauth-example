FROM node:12

MAINTAINER JeongKuk Seo <wjdrnr6662@gmail.com>

WORKDIR /app
COPY package*.json .
RUN npm install

COPY source/ .
#RUN npm install -g nodemon
CMD [ "node", "app.js"]
