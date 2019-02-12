# rubocop:disable all
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)
env = ENV['RAILS_ENV'] || "development"
require 'bundler/setup' # Set up gems listed in the Gemfile.
require 'bootsnap/setup' if (env == "development") || (env == "test") # Speed up boot time by caching expensive operations.

if ENV['DOCKER']
  require 'rails/commands/server'

  module Rails
    class Server
      alias :default_options_bk :default_options
      def default_options
        default_options_bk.merge!(Host: '0.0.0.0')
      end
    end
  end
end
