# frozen_string_literal: true

source "https://rubygems.org"
ruby "2.6.1"

# Core
gem "rails", "6.0.2"
gem "puma"

# Database
gem "pg"
gem "redis"

# Extensions
gem "bootsnap", require: false
gem "mini_magick"
gem "dotenv-rails"
gem "rails-i18n"
gem "active_model_serializers"
gem "rack-cors", require: "rack/cors"
gem "rack-cache"
gem "redis-rack-cache"
gem "oj"
gem "sidekiq"
gem "sidekiq-scheduler"
gem "kaminari"
gem "groupdate"
gem "bcrypt"
gem "friendly_id"
gem "countries", require: "countries/global"
gem "document_serializable"
gem "sitemap_generator"
gem "image_processing"
gem "icalendar", "~> 2.4"
gem "httparty"
gem "activeadmin"
gem "graphql"
gem "graphql-batch"
gem "graphiql-rails"

# Assets
gem "webpacker", require: false

# Seed Data
gem "database_cleaner"
gem "factory_bot_rails"
gem "faker"

# Services
gem "newrelic_rpm"
gem "airbrake"
gem "aws-sdk-s3"

group :development, :test do
  gem "rspec-rails"
  gem "guard-rspec", require: false
  gem "rubocop", require: false
  gem "rubocop-rspec-focused", require: false
  gem "rubocop-rails", require: false
  gem "webmock", require: false
  gem "timecop"
  gem "rspec_junit_formatter"
  gem "vcr"
  gem "capybara"
  gem "capybara-screenshot"
  gem "capybara-selenium"
  gem "chromedriver-helper"
end

group :development do
  gem "listen"
  gem "spring"
  gem "spring-watcher-listen"
  gem "spring-commands-rspec"
  gem "web-console"
  gem "annotate"
  gem "erd", require: false
  gem "rb-fsevent"
  gem "letter_opener"
end
