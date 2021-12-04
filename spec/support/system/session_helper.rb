# frozen_string_literal: true

module SessionHelper
  def login(user)
    visit root_path if current_path == ","
    page.set_rack_session(user_id: user.id)
  end
end

RSpec.configure do |config|
  config.include SessionHelper, type: :system
end
