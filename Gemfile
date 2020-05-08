source "http://rubygems.org"

ruby "2.5.3"

gem "passenger"
gem "zip"
gem "rails", "5.2.2"
gem "rails_12factor"
# postgres gem
gem "pg", "0.20.0"
gem "httparty"
gem "normalize-rails", "~> 3.0.0"
# Use SCSS for stylesheets
gem "sass-rails", "~> 5.0"
# Use Uglifier as compressor for JavaScript assets
gem "uglifier", ">= 1.3.0"
# Use CoffeeScript for .coffee assets and views
gem "coffee-rails", "~> 4.2.0"
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem "therubyracer", platforms: :ruby
# gem gon lets you set variables in controller that you can access in javascript
gem "gon"
gem "geocoder"

gem "rolify"

# Use jquery as the JavaScript library
gem "jquery-rails"
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem "turbolinks"
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder", "~> 2.7"
# bundle exec rake doc:rails generates the API under doc/api.
gem "rake", "~> 12.3"
gem "sdoc", "~> 0.4.0", group: :doc
#  Lets us spawn processes in the background
gem "spawnling", "~>2.1"
gem "graphql-batch"

# Use ActiveModel has_secure_password
# gem "bcrypt", "~> 3.1.7"

# Use Unicorn as the app server
# gem "unicorn"

gem "mini_magick"
#  User creation gem
gem "devise"
# ** Be careful upgrading searchkick **
# By default it will update elasticsearch/elasticsearch-api to version 7 which breaks
# Searchly which we use for elasticsearch on production.
gem "searchkick", "~> 4.3.0"
gem "font-awesome-rails"
gem "font-awesome-sass"
gem "bootstrap-sass"
gem "autoprefixer-rails"
gem "backbone-rails"

gem "execjs"
gem "mini_racer"
gem "figaro"
gem "puma"
gem "net-ssh"

gem "will_paginate"

group :test do
  gem "rspec-rails", "~> 3.8"
end

group :development do
  # gem "byebug"
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem "web-console"
  gem "solargraph"
end

group :development, :test do
  gem "dotenv-rails"
  gem "pry-byebug"
  gem "pry-rails"
  gem "bootsnap", require: false
  gem "listen", "~> 3.0"
end

gem "activejob-traffic_control", ">= 0.1.3"
gem "jwt", ">=2.2.0"
gem "sidekiq"
gem "sidekiq-cron"
gem "rack-cors"
gem "diffy"
gem "kramdown"
gem "front_matter_parser"
gem "mailgun-ruby", "~>1.1.6"
gem "graphql"
gem "graphiql-rails", "~> 1.4.11"
gem "faraday", "~> 1"

gem "activerecord-import", "~> 1.0"
gem "composite_primary_keys"

gem "timeliness", "~> 0.4.4"

gem "webmock", "~> 3.8", group: :test

gem "rspec-snapshot", "~> 0.1.2", group: :test

gem "http_logger", "~> 0.6.0"

gem "factory_bot", "~> 5.1", group: :test

gem "faker", "~> 2.11", group: :test

gem "database_cleaner-active_record", "~> 1.8", group: :test

gem "aws-sdk-s3", "~> 1.63", require: true
