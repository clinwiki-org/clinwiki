FROM keymetrics/pm2:14-alpine
RUN mkdir -p /nodejs
WORKDIR /nodejs
COPY ./api .
RUN npm install
#RUN pm2 install pm2-logrotate
EXPOSE 8088
#CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
