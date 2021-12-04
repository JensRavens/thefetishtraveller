# frozen_string_literal: true

require "rails_helper"
require "rack_session_access/capybara"

Dir[File.join(__dir__, "system/support/**/*.rb")].sort.each { |file| require file }

Rails.application.routes.default_url_options[:locale] = :en
Rails.application.routes.default_url_options[:debug] = true

RSpec.configure do |config|
  config.before(:each, type: :system) do
    driven_by Capybara.javascript_driver
  end
end
