# frozen_string_literal: true

require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

Dotenv::Railtie.load

module Thefetishtraveller
  class Application < Rails::Application
    config.load_defaults 5.2
    config.time_zone = "Berlin"

    config.action_mailer.default_url_options = { host: ENV["HOST"] } if ENV["HOST"].present?
    config.active_job.queue_adapter = :sidekiq
    # config.active_storage.variant_processor = :vips
  end
end
