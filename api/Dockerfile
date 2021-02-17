FROM node:14.15.5-alpine
RUN mkdir -p /nodejs
WORKDIR /nodejs
COPY ./api .

# This is a hack to make sure bcrypt has the right navtive libs installed
RUN npm uninstall bcrypt
RUN npm install bcrypt

RUN npm install
EXPOSE 8088
