#!/bin/bash

# PRODUCTION
git reset --hard 
git checkout main 
git pull origin main

npm i
npm run build
pm2 start process.config.js --env production



# DEVELOPMENT
# git reset --hard 

# npm i
# pm2 start "npm run start:dev" --name=BookBazaar