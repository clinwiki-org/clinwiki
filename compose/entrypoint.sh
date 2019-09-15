#!/bin/bash
rm -f /clinwiki/tmp/pids/server.pid
bundle install
bundle exec rake db:create
bundle exec rake db:migrate
./front/scripts/build
bundle exec sidekiq -C config/sidekiq.yml &
bundle exec rails server -b 0.0.0.0
