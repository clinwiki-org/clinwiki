#!/bin/bash
cd front
yarn install
yarn run build

cd ../api
npm uninstall bcrypt
npm install bcrypt
npm install
npm run build
