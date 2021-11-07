# frozen_string_literal: true

# Load the Rails application.
require File.expand_path("application", __dir__)

# Initialize the Rails application.
Rails.application.initialize!

host = if ENV["HOST"].present?
  ENV["HOST"]
elsif ENV["HEROKU_APP_NAME"].present?
  "https://#{ENV['HEROKU_APP_NAME']}.herokuapp.com"
else
  "http://localhost:3000"
end

Rails.application.routes.default_url_options[:host] = host
