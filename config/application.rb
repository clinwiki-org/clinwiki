# rubocop:disable all
require File.expand_path('../boot', __FILE__)
require 'rails/all'
require_relative '../app/middlewares/redirect'
# developed using ruby-2.1.2 & Rails 4.2.0
#
#To prevent error:  Faraday::SSLError: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed
require 'openssl'
#OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Clinwiki
  class Application < Rails::Application
    config.jwt_expiration_secs = ENV["JWT_EXPIRATION_SECS"] || 86400
    config.time_zone = 'Eastern Time (US & Canada)'
    config.quiet_assets = true
    config.generators do |generate|
      generate.helper false
      generate.javascript_engine false
      generate.request_specs false
      generate.routing_specs false
      generate.stylesheets false
      generate.test_framework :rspec
      generate.view_specs false
    end
    config.active_record.schema_format = :ruby
    config.action_controller.action_on_unpermitted_parameters = :raise
    # config.active_record.raise_in_transactional_callbacks = true
    config.active_job.queue_adapter = :sidekiq
    config.eager_load_paths += [
      "#{config.root}/app/workers",
      "#{config.root}/app/docs"
    ]

    config.es_url = ENV.fetch("SEARCHBOX_URL", ENV.fetch("ELASTICSEARCH_URL", "http://localhost:9200"))

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'http://localhost:3001',
                'http://localhost:3000',
                'http://mysite.localhost:3001',
                'http://test.localhost:3001',
                'http://clinwiki-prod.herokuapp.com',
                'http://clinwiki-dev.herokuapp.com'
        resource '*',
          :headers => :any,
          :methods => [:get, :post, :options, :delete, :put, :patch],
          :credentials => true
      end
    end
    config.middleware.insert_before 1,  Rack::Redirect
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
		#config.assets.initialize_on_precompile = false
		config.assets.enabled = true
		# config.active_record.raise_in_transactional_callbacks = true
  end
end
