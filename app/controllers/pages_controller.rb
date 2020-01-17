# frozen_string_literal: true

class PagesController < ApplicationController
  def show
    @path_segments = params[:path].to_s.split("/").last(2)
    @event = Event.published.find_by(slug: @path_segments.second) if @path_segments.size > 1 && @path_segments.first == "events"
  end

  def sitemap
    file = open("https://theftraveller.s3.amazonaws.com/sitemaps/sitemap.xml.gz")
    send_data file.read, filename: "sitemap.xml.gz", type: "application/xml", disposition: "inline"
  end
end
