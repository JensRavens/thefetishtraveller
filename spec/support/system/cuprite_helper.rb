# frozen_string_literal: true

module CupriteHelper
  def pause
    page.driver.pause
  end

  def debug
    page.driver.debug(binding)
  end
end

RSpec.configure do |config|
  config.include CupriteHelper, type: :system
end
