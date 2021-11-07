# frozen_string_literal: true

require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

Dotenv::Railtie.load

require_relative "../lib/middleware/cloudflare_proxy"

module Thefetishtraveller
  class Application < Rails::Application
    config.load_defaults 6.1
    config.time_zone = "Berlin"

    config.middleware.use CloudflareProxy

    config.action_mailer.default_url_options = { host: ENV["HOST"] } if ENV["HOST"].present?
    config.active_job.queue_adapter = :sidekiq
    config.action_view.form_with_generates_remote_forms = false

    config.autoload_paths << Rails.root.join("app/form_builders")
    config.assets.paths << Rails.root.join("node_modules")
    config.exceptions_app = routes
  end
end
