#!/bin/bash

# PRODUCTION
git reset --hard 
git checkout main 
git pull origin main

docker compose down
docker compose up -d
docker compose logs --tail=200 -f



# DEVELOPMENT
# git reset --hard 

# npm i
# pm2 start "npm run start:dev" --name=BookBazaar