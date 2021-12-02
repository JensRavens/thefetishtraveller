# frozen_string_literal: true

module ComponentHelper
  def hero(style: "normal", background_image: nil, background_color: nil, &block)
    render "components/hero", style: style, background_image: background_image, background_color: background_color, content: capture(&block)
  end

  def magazine_header(&block)
    content = capture(&block) if block
    render "magazines/header", content: content
  end

  def spacer(size = nil, only: nil)
    content_tag(:div, nil, class: ["spacer", ("spacer--#{size}" if size.present?), ("desktop-only" if only == :desktop)])
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
    turbo_frame_tag "pagination-frame", options.reverse_merge(target: "_top") do
      render "components/pagination", items: scope, partial: partial
    end
  end
end
