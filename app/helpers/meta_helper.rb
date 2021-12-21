# frozen_string_literal: true

module MetaHelper
  def title(page_title)
    return if page_title.blank?

    content_for :title, strip_tags(page_title), flush: true
    page_title
  end

  def description(description_text)
    return if description_text.blank?

    content_for :description, strip_tags(description_text.to_s).squish, flush: true
    description_text
  end

  def thumbnail(image)
    return if image.blank?

    content_for :thumbnail_url, image_file_url(image, width: 1200), flush: true
    image
  end

  def canonical(path)
    content_for :canonical_url, path, flush: true
  end

  def article_json_ld(article)
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: strip_tags(article.title),
      image: [image_file_url(article.hero, relative: false)].compact,
      datePublished: article.publish_at,
      dateModified: article.updated_at,
      author: [{
        "@type": "Person",
        name: article.user.public_name,
        url: profile_url(article.user)
      }]
    }
  end

  def event_json_ld(event)
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.name,
      startDate: event.start_at,
      endDate: event.end_at,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: event.location.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: event.location.address,
          addressLocality: event.location.city,
          postalCode: event.location.zip,
          addressCountry: event.location.country_code
        }
      },
      image: [image_file_url(event.hero, relative: false), image_file_url(event.header, relative: false), image_file_url(event.flyer, relative: false)].compact,
      description: event.abstract,
      organizer: {
        "@type": "Organization",
        name: event.organizer_name,
        url: event.website
      }
    }
  end
end
