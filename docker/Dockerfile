FROM nodejs:latest as node-builder
WORKDIR /front
RUN yarn build
WORKDIR /api
RUN npm install
RUN npm run build
RUN npm run server

FROM nginx:stable
COPY nginx.conf /etc/nginx/nginx.conf
COPY -from=node-builder /front/build/ /usr/share/nginx/html/
