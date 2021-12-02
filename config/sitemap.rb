# frozen_string_literal: true

# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://thefetishtraveller.com"
SitemapGenerator::Sitemap.public_path = "tmp/sitemaps/"

SitemapGenerator::Sitemap.create do
  I18n.available_locales.each do |locale|
    add root_path(locale: locale), changefreq: :weekly, priority: 0.5
    add events_path(locale: locale), changefreq: :daily, priority: 0.8
    add magazine_path(locale: locale), changefreq: :daily, priority: 0.8
    add titleholders_path(locale: locale), changefreq: :daily, priority: 0.8

    [Event, Titleholder, Article].each do |resource|
      resource.listed.find_each do |record|
        add polymorphic_path(id: record, locale: locale), lastmod: record.updated_at
      end
    end
  end
end
