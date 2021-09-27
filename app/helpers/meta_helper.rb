# frozen_string_literal: true

module MetaHelper
  def title(page_title)
    return if page_title.blank?

    content_for :title, page_title, flush: true
    page_title
  end

  def description(description_text)
    return if description_text.blank?

    content_for :description, description_text, flush: true
    description_text
  end

  def thumbnail(image)
    return if image.blank?

    content_for :thumbnail_url, image_asset_url(image, width: 200), flush: true
    image
  end

  def canonical(path)
    content_for :canonical_url, path, flush: true
  end
end
