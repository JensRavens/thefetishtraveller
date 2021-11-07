require "rails_helper.rb"

Dir[File.join(__dir__, "system/support/**/*.rb")].sort.each { |file| require file }

RSpec.configure do |config|
  config.before(:each, type: :system) do
    driven_by Capybara.javascript_driver
  end
end
