FROM node:latest as node-build
 
COPY . .
 
WORKDIR /front
 
RUN npm install
 
RUN npm run build
 
FROM nginx:stable
 
COPY --from=node-build /front/build /usr/share/nginx/html
 
EXPOSE 8088
 
CMD nginx -g 'daemon off;'
