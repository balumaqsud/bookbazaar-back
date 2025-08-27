#!/bin/bash

# PRODUCTION
git reset --hard 
git checkout main 
git pull origin main

docker compose up -d



# DEVELOPMENT
# git reset --hard 

# npm i
# pm2 start "npm run start:dev" --name=BookBazaar