# frozen_string_literal: true

module ComponentHelper
  def hero(style: "normal", background_image: nil, &block)
    render "components/hero", style: style, background_image: background_image, content: capture(&block)
  end

  def attends?(event:)
    current_user&.events&.include?(event)
  end
end
