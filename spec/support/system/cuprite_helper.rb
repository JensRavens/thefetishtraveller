# frozen_string_literal: true

module CupriteHelper
  def pause
    page.driver.pause
  end

  def debug(*args)
    page.driver.debug(*args)
  end
end

RSpec.configure do |config|
  config.include CupriteHelper, type: :system
end
