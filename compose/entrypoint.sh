#!/bin/bash
rm /clinwiki/tmp/pids/server.pid
bundle install
bundle exec rake db:create
bundle exec rake db:migrate
(cd front; CW_PATH=.. scripts/build)
bundle exec sidekiq -C config/sidekiq.yml &
bundle exec rails server -b 0.0.0.0
