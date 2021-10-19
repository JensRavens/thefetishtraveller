# frozen_string_literal: true

module ComponentHelper
  def hero(style: "normal", background_image: nil, &block)
    render "components/hero", style: style, background_image: background_image, content: capture(&block)
  end

  def attends?(event:)
    current_user&.events&.include?(event)
  end

  def modal_url(path, size: :regular)
    "javascript:ui.modal.load('#{path}', '#{size}')"
  end

  def close_modal_path
    "javascript:ui.modal.close()"
  end
end
