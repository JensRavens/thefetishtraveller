# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    @events = Event.published.in_future.chronologic.limit(6)
  end

  def sitemap
    file = open("https://theftraveller.s3.amazonaws.com/sitemaps/sitemap.xml.gz")
    send_data file.read, filename: "sitemap.xml.gz", type: "application/xml", disposition: "inline"
  end
end
