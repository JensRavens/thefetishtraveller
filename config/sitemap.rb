# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://thefetishtraveller.com"
SitemapGenerator::Sitemap.public_path = "tmp/sitemaps/"

SitemapGenerator::Sitemap.create do
  add "/", changefreq: :daily, priority: 1
  add "/events", changefreq: :daily, priority: 1

  Event.published.find_each do |event|
    add "/events/#{event.slug}", changefreq: :daily, priority: 0.9
  end

  Location.find_each do |location|
    add "/location/#{location.slug}", changefreq: :weekly, priority: 0.6
  end
end
