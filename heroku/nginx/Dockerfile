FROM node:latest as node-build

COPY . .

WORKDIR /front

RUN npm install

RUN npm run build

FROM nginx:stable

#COPY heroku/nginx/default.conf.template /etc/ngin/conf.d/default.conf.template
COPY --from=node-build /front/build /usr/share/nginx/html

#CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
#CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf.template && nginx -g 'daemon off;'
CMD nginx -g 'daemon off;'