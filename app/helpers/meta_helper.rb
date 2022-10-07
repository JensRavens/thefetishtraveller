# frozen_string_literal: true

module MetaHelper
  def article_json_ld(article)
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: strip_tags(article.title),
      image: [image_file_url(article.hero)].compact,
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
      image: [image_file_url(event.hero), image_file_url(event.header), image_file_url(event.flyer)].compact,
      description: event.abstract,
      organizer: {
        "@type": "Organization",
        name: event.organizer_name,
        url: event.website
      }
    }
  end
end
