# frozen_string_literal: true

source "https://rubygems.org"
ruby "2.7.3"

# Core
gem "rails", "6.1.4.1"
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
gem "nokogiri"
gem "slim-rails"
gem "jwt"
gem "pundit"
gem "acts-as-taggable-on"

# Assets
gem "webpacker"
gem "sass-rails"
gem "autoprefixer-rails"
gem "turbo-rails"

# Seed Data
gem "database_cleaner"
gem "factory_bot_rails"
gem "faker"

# Services
gem "newrelic_rpm"
gem "aws-sdk-s3"

group :development, :test do
  gem "rspec-rails"
  gem "rubocop", require: false
  gem "rubocop-rails", require: false
  gem "capybara"
  gem "webdrivers"
  gem "pry-rails"
  gem "guard"
  gem "guard-minitest"
  gem "i18n-tasks"
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
  gem "guard-livereload", require: false
end
