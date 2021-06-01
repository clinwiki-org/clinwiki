#!/bin/bash
echo "BUILDING FRONTEND"
cd front
yarn install
yarn run build

echo "BUILDING BACKEND"
cd ../api
npm uninstall bcrypt
npm install bcrypt
npm install

echo "BUILD COMPLETE"