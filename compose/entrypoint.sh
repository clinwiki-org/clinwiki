#!/bin/bash

# default mode "PROD"
CW_MODE=${CW_MODE:-'PROD'}
# Valid modes:  PROD, WORKER, FAST, DEV

if [[ $CW_MODE == 'PROD' || $CW_MODE == 'FAST' ]]; then
    rm -f /clinwiki/tmp/pids/server.pid
fi

bundle install
echo MODE=$CW_MODE
flock -x ./entrypoint.lock bundle exec rake db:create
flock -x ./entrypoint.lock bundle exec rake db:migrate
if [ $CW_MODE == "PROD" ]; then
    ./front/scripts/build
fi

# load env
if [ -f ".env" ]; then
   . .env
fi

# This line executes the CMD from Dockerfile, command from docker-compose file or if you docker run
echo MODE=$CW_MODE
if [ $CW_MODE == "DEV" ]; then
    echo "Waiting for user to start rails server manually..."
    echo "docker exec -it clinwiki bundle exec rails server -b 0.0.0.0"
    while :
    do sleep 3600
    done
else
    exec "$@"
fi
