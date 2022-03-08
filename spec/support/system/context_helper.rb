# frozen_string_literal: true

module ContextHelper
  def open_context
    find(".context-menu").click
  end
end

RSpec.configure do |config|
  config.include ContextHelper, type: :system
end
