# frozen_string_literal: true

module ComponentHelper
  def hero(style: "normal", background_image: nil, &block)
    render "components/hero", style: style, background_image: background_image, content: capture(&block)
  end

  def attends?(event:)
    current_user&.events&.include?(event)
  end

  def modal_url(url, size: :regular, title: nil, close: false)
    "javascript:ui.modal.load(#{{ url: url, size: size, title: title, close: close }.to_json})"
  end

  def close_modal_path
    "javascript:ui.modal.close()"
  end

  def paginated(scope, partial: nil, **options)
    turbo_frame_tag "pagination-frame", options do
      render "components/pagination", items: scope, partial: partial
    end
  end
end
