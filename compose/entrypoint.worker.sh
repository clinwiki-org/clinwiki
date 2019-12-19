#!/bin/bash
bundle install
bundle exec rake db:create
bundle exec rake db:migrate

# This line executes the CMD from Dockerfile, command from docker-compose file or if you docker run
exec "$@"